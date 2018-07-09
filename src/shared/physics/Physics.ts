import { Box } from "./Box";
import { Circle } from "./Circle";
import { Collider, ColliderDef } from "./Collider";
import { ShapeType } from "./Shape";

import { Dictionary } from "../utils/Dictionary";

import * as SAT from "sat"
import { Transform } from "../utils/Transform";

export class Physics {
    
    private colliders:Array<Collider> = new Array<Collider>();
    private moved:Array<Collider> = new Array<Collider>();
    private checked:Array<Collider> = new Array<Collider>();
    private collisionMap:Dictionary<Array<Collider>> = new Dictionary<Array<Collider>>();
    private destroyed:Array<Collider> = new Array<Collider>();
    private static colliderId:number = -1;

    public update(delta:number):void {
        let response = new SAT.Response();

        while (this.moved.length > 0) {
            let collider:Collider = this.moved.pop();
            this.testWithAll(collider, response);
        }

        while (this.destroyed.length > 0) {
            let collider:Collider = this.destroyed.pop();
            this.colliders.splice(this.colliders.indexOf(collider), 1);
            if (this.collisionMap.containsKey(collider.id)) {
                this.collisionMap.remove(collider.id);
            }
        }
    }

    public createCollider(colliderDef:ColliderDef, transform:Transform):Collider {
        let collider:Collider;
        let vec = new SAT.Vector(colliderDef.x ? colliderDef.x : 0, colliderDef.y ? colliderDef.y : 0);
        let id = ++Physics.colliderId;

        if (colliderDef.shape == ShapeType.Circle) {
            collider = new Collider(
                colliderDef.shape, 
                new SAT.Circle(vec, colliderDef.radius), 
                this, 
                id,
                transform);
        }
        else if (colliderDef.shape == ShapeType.Box) {
            collider = new Collider(
                colliderDef.shape, 
                new SAT.Box(vec, colliderDef.width ? colliderDef.width : 0, colliderDef.height ? colliderDef.height : 0).toPolygon(), 
                this, 
                id,
                transform
            );
        }

        this.colliders.push(collider);
        return collider;
    }

    public destroy(collider:Collider):void {
        this.destroyed.push(collider);
    }

    public onMoved(collider:Collider):void {
        this.updateCollider(collider);
        if (this.moved.indexOf(collider) === -1) {
            this.moved.push(collider);
        }
    }

    private testWithAll(colliderA:Collider, response:SAT.Response):void {
        for (let i = 0, l = this.colliders.length;  i < l ; ++i) {
            let colliderB = this.colliders[i];
            if (colliderB === colliderA || this.isDestroyed(colliderB)) continue;

            let foundCollision = false;
            response.clear();

            let collisions = this.collisionMap.item(colliderA.id);

            if (this.testCircle(colliderA, colliderB, response)) {
                if (collisions == null) {
                    collisions = this.collisionMap.add(colliderA.id, new Array<Collider>());
                }

                if (collisions.indexOf(colliderB) === -1) {                    
                    if (colliderA.onEnterCollision != null) {
                        colliderA.onEnterCollision.call([colliderA, colliderB]);
                    }

                    if (this.isDestroyed(colliderA)) {
                        return;
                    }
    
                    if (colliderB.onEnterCollision != null) {
                        colliderB.onEnterCollision.call([colliderA, colliderB]);
                    }

                    if (this.isDestroyed(colliderB)) {
                        return;
                    }

                    collisions.push(colliderB);
                }

                if (colliderA.isSensor || colliderB.isSensor) continue;

                colliderA.shape.pos.x -= response.overlapV.x; 
                colliderA.shape.pos.y -= response.overlapV.y;
                colliderA.transform.x = colliderA.shape.pos.x;
                colliderA.transform.y = colliderA.shape.pos.y;

                this.updateCircleAABB(colliderA);
            }
            else
            {
                if (collisions != null && collisions.indexOf(colliderB) !== -1) {
                    if (colliderA.onExitCollision != null) {
                        colliderA.onExitCollision.call([colliderA, colliderB]);
                    }
    
                    if (colliderB.onExitCollision != null) {
                        colliderB.onExitCollision.call([colliderA, colliderB]);
                    }

                    collisions.splice(collisions.indexOf(colliderB), 1);
                }
            }
        }
    }

    private isDestroyed(collider:Collider):boolean {
        return this.destroyed.indexOf(collider) !== -1; 
    }

    private updateCollider(collider:Collider):void {
        switch (collider.shape.type) {
            case ShapeType.Box: {
                this.updateBoxAABB(collider);
                break;
            }
            case ShapeType.Circle: {
                this.updateCircleAABB(collider);
                break;
            }
        }
    }

    private updateBoxAABB(collider:Collider):void {
        let points = collider.shape.calcPoints;
        let aabb = collider.aabb;

        aabb.min.x = points[0].x;
        aabb.min.y = points[0].y;
        aabb.max.x = points[2].x;
        aabb.max.y = points[2].y;
    }

    private updateCircleAABB(collider:Collider):void {
        let aabb = collider.aabb;
        let r = collider.shape.r;
        let center = collider.shape.pos;

        aabb.min.x = center.x - r;
        aabb.min.y = center.y - r;
        aabb.max.x = center.x + r;
        aabb.max.y = center.y + r;
    }

    private testCircle(a:Collider, b:Collider, response:SAT.Response):boolean {
        if (b.type === ShapeType.Circle) {
            return SAT.testCircleCircle(a.shape, b.shape, response);
        } else {
            return SAT.testCirclePolygon(a.shape, b.shape, response);
        }
    }
}