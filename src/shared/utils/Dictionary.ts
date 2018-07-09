export class Dictionary<T> {
    private items: {[index:number]: T} = {};

    private _count:number = 0;

    public get count():number {
        return this._count;
    }

    public add(key:string | number, value:T):T {
        if (!this.items.hasOwnProperty(key)) {
            this._count++;
        }

        this.items[key] = value;
        return value;
    }

    public remove(key:number):void {
        let value = this.items[key];
        delete this.items[key];
        this._count--;
    }

    public containsKey(key:number):boolean {
        return this.items.hasOwnProperty(key);
    }

    public item(key:number):T {
        return this.items[key];
    }
}