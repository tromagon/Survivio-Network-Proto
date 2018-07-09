import { Context } from "./Context";
import { Input } from "../utils/Input";
import { KeyCode } from "../utils/KeyCode";
import { Network } from '../../shared/network/core/Network';
import { NetIncomingPacket } from "../../shared/network/core/NetIncomingPacket";
import { PacketStream } from '../../shared/network/stream/PacketStream';
import { ClientWebSocket } from "../network/ClientWebSocket";
import { ClientSocket } from "../network/ClientSocket";
import { StateMachine } from "../utils/StateMachine";
import { Message } from "../../shared/network/core/Message";
import { MessageType } from "../../shared/network/messages/MessageType";
import { JoinMessage } from "../../shared/network/messages/JoinMessage";
import { UpdateMessage } from "../../shared/network/messages/UpdateMessage";
import { ClientEntity } from '../network/ClientEntity';
import { LocalCEntity } from '../network/LocalCEntity';
import { RemoteCEntity } from '../network/RemoteCEntity';
import { UserInputMessage } from "../../shared/network/messages/UserInputMessage";
import { Packet } from "../../shared/network/core/Packet";
import { ClientWorld } from "../game/ClientWorld";
import { BitStream } from "bit-buffer";
import { Time } from '../utils/Time';
import { EntityType } from '../../shared/network/EntityType';

export type ClientEntities = { [Key: number]: ClientEntity };
export type RemoteEntities = { [Key: number]: RemoteCEntity };

enum GameState {
    Join,
    Play
}

export class GameContext extends Context {
    public static readonly ID = 'Game.ID';
    private input:Input;
    private network:Network = new Network();
    private socket:ClientSocket;
    private lastServerSeqNumber:number;

    private serverTickRate: number;
    private packetStream:PacketStream = new PacketStream();
    private states:StateMachine;

    private localEntity:LocalCEntity;
    private localEntityId:number;
    private entities:ClientEntities = {};
    private remoteEntities: RemoteEntities = {};

    private world:ClientWorld;
    private mouseDirection:number;
    private lastMouseDirection:number;

    public enter(data?:any) {
        this.input = new Input();

        this.world = new ClientWorld(this.gameApplication);
        this.world.createMap(5, 5, 550, 550);
        
        this.createSocket();

        this.states = new StateMachine();
        this.states.register(GameState.Join, () => this.enterJoin(), (delta:number) => this.updateJoin(delta));
        this.states.register(GameState.Play, () => this.enterPlay(), (delta:number) => this.updatePlay(delta));
        this.states.changeState(GameState.Join);
    }

    private createSocket() {
        const url = location.origin.replace(/^http/, 'ws');
        this.socket = new ClientWebSocket(url);
        this.socket.onConnected = () => this.onClientConnected();
        this.socket.onDisconnected = () => this.onDisconnected();
        this.socket.onMessage = (message:any) => this.onMessage(message);
    }

    private onClientConnected():void {
        console.log("Connected to server");
        this.network.connectPeer(0);
    }

    private onDisconnected():void {
        console.log("Disconnected to server");
    }
    
    private onMessage(message:any):void {
        this.network.onMessage(0, message);
    }

    private enterJoin():void {
        console.log("send join request");
    }

    private enterPlay():void {
        this.gameApplication.stage.interactive = true;
        this.gameApplication.stage.cursor = "crosshair";
        this.gameApplication.stage.on("mousemove", (event) => this.onMouseMove(event));

        this.world.setCameraTarget(this.localEntity.id);

        global.setInterval(
            () => this.sendPackets(),
            1000 / 20
        );
    }

    public update(delta:number) {
        this.processServerMessages(Time.currentTime);
        this.states.update(delta);
    }

    private updateJoin(delta:number):void {
        if (this.localEntity) {
            
            this.states.changeState(GameState.Play);
        }
    }

    private updatePlay(delta:number):void {
        this.processInputs(Time.delta);
        this.world.update(delta);
        // error correction here if necessary

        if (E_INTERP) {
            this.interpolateEntities();
        }
    }

    private sendPackets() {
        // for now we send all inputs immediately
        let buffer = this.network.getSendBuffer(0);

        let packet = new Packet();
        packet.ack = this.lastServerSeqNumber;

        if (buffer && buffer.length > 0) {
            while (buffer.length > 0) {
                packet.messages.push(buffer.shift());            
            }
        }

        const arrayBuf = new ArrayBuffer(4096);
        const stream = new BitStream(arrayBuf);
        this.packetStream.write(packet, stream);
        this.socket.send(new Uint8Array(arrayBuf, 0, stream.byteIndex));
    }

    private processServerMessages(nowTS:number):void {
        let incomingMessages = this.pollpackets(nowTS);

        for (let incomingMessage of incomingMessages) {

            let bitStream = new BitStream(incomingMessage.packet);
            let packet = this.packetStream.read(bitStream, new Packet());

            for (let message of packet.messages) {
                this.readMessage(message);
            }
        }
    }

    private readMessage(message:Message):void {
        switch(message.type) {
            case MessageType.Join: {
                const joinMessage = message as JoinMessage;
                this.localEntityId = joinMessage.playerEntityId;
                this.serverTickRate = joinMessage.tickRate;
                break;
            }

            case MessageType.Update: {
                this.processServerUpdate(message as UpdateMessage);
                break;
            }
        }
    }

    private processServerUpdate(updateMessage:UpdateMessage) {
        if (updateMessage.seqNum <= this.lastServerSeqNumber) return;

        this.lastServerSeqNumber = updateMessage.seqNum;

        if (this.localEntity) {
            this.localEntity.ackInput = updateMessage.ackInput;
        }

        for (let entityState of updateMessage.fullStates) {
            let entity:ClientEntity;

            if (!this.entities[entityState.entityId]) {
                if (entityState.entityId == this.localEntityId) {
                    this.localEntity = new LocalCEntity(entityState.entityId);
                    this.world.createCharacter(this.localEntity);
                    entity = this.localEntity;
                }
                else {
                    if (entityState.type == EntityType.Character) {
                        let remoteEntity = new RemoteCEntity(entityState.entityId);
                        this.world.createCharacter(remoteEntity);
                        this.remoteEntities[entityState.entityId] = remoteEntity;
                        entity = remoteEntity;
                    }
                    else {
                        this.world.createObject(entityState);
                    }
                }

                this.entities[entityState.entityId] = entity;
            }
            else {
                entity = this.entities[entityState.entityId];
            }

            if (entity) {
                entity.applyState(entityState);
            }
        }

        for (let entityState of updateMessage.deltaStates) {
            let entity:ClientEntity = this.entities[entityState.entityId];
            if (!entity) {
                // Maybe request a whole state if too much discrepency?
                console.log("Massive desync with the server");
            }

            entity.applyState(entityState);
        }
    }

    private processInputs(delta: number):void {
        let userInputMessage = new UserInputMessage();

        let keyRight = this.input.isKeyDown(KeyCode.right);
        let keyLeft = this.input.isKeyDown(KeyCode.left);
        let keyUp = this.input.isKeyDown(KeyCode.up);
        let keyDown = this.input.isKeyDown(KeyCode.down);

        if (!keyDown && !keyUp && !keyLeft && !keyRight && this.mouseDirection == this.lastMouseDirection) return;

        if (keyRight) {
            userInputMessage.hMove = 1;
        }
        else if (keyLeft) {
            userInputMessage.hMove = -1;
        }
        
        if (keyUp) {
            userInputMessage.vMove = -1;
        }
        else if (keyDown) {
            userInputMessage.vMove = 1;
        }

        userInputMessage.pressTime = delta;
        userInputMessage.inputSequenceNumber = this.localEntity.incrementSequenceNumber();
        userInputMessage.mouseDirection = this.mouseDirection;

        this.lastMouseDirection = this.mouseDirection;

        if (C_PREDICT) {
            this.localEntity.applyInput(userInputMessage);
        }

        this.network.enqueueSend(0, userInputMessage);

        // save input for later reconciliation
        if (S_RECONC) {
            this.localEntity.saveInput(userInputMessage);
        }
    }

    private onMouseMove(event:PIXI.interaction.InteractionEvent):void {
        this.mouseDirection = Math.atan2((event.data.global.y - this.gameApplication.screen.height / 2), 
            (event.data.global.x - this.gameApplication.screen.width / 2));
    }

    private interpolateEntities():void {
        let renderTimestamp = Time.currentTime - (1000.0 / this.serverTickRate);
        for (let i in this.remoteEntities) {
            let entity = this.remoteEntities[i];
            entity.interpolate(renderTimestamp);
        }
    }

    private pollpackets(timestamp: number): NetIncomingPacket[] {
        let incomingPackets = [];
        while (true) {
            let incomingPacket = this.network.receive(timestamp);
            if (!incomingPacket) {
                break;
            }

            incomingPackets.push(incomingPacket);
        }

        return incomingPackets;
    }
}