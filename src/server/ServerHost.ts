import * as express from 'express';
import { BitStream } from "bit-buffer";
import { createServer, Server } from "http";
import { Host } from "shared/network/core/Host";
import { UserInputMessage } from "shared/network/messages/UserInputMessage";
import { Client, ClientState } from "./Client";
import { ServerSocket } from "network/ServerSocket";
import { Snapshot } from "network/Snapshot";
import { NetworkEntity } from "network/NetworkEntity";
import { ServerWebSocket } from "network/ServerWebSocket";
import { MessageType } from 'shared/network/messages/MessageType';
import { JoinMessage } from 'shared/network/messages/JoinMessage';
import { PacketStream } from 'shared/network/stream/PacketStream';
import { Packet } from 'shared/network/core/Packet';
import { Message } from 'shared/network/core/Message';
import { UpdateMessage } from 'shared/network/messages/UpdateMessage';
import { EntityState } from "shared/network/core/EntityState";
import { World } from "game/World";

export class ServerHost extends Host {
    private app:express.Application;
    private server:Server;
    private serverSocket:ServerSocket;
    private clients:Array<Client> = [];
    private currentTS: number;
    private snapshots:Array<Snapshot> = [];
    private packetStream:PacketStream = new PacketStream();
    private readonly maxSnapshotTime:number = 5;
    private maxNumSnapshots:number;
    private world:World;

    constructor() {
        super();

        this.app = express();
        this.server = createServer(this.app);

        this.serveFiles();
        this.createSocket();
        this.listen(process.env.PORT || PORT);
        this.setUpdateRate(+process.env.TICK_RATE || TICK_RATE);

        this.maxNumSnapshots = this.tickRate * this.maxSnapshotTime;
        this.world = new World(5, 4, 550);
    }

    protected update(delta:number) {
        this.currentTS = +new Date();

        this.processClientMessages();
        this.world.update(delta);
        this.createSnapshot();
        this.updateClients();
    }

    private serveFiles():void {
        this.app.get('/', function (req, res) {
            res.sendFile(__dirname + '/client/index.html');
        });
        this.app.use(express.static(__dirname + '/client'));
    }

    private createSocket():void {
        this.serverSocket = new ServerWebSocket(this.server);
        this.serverSocket.onClientConnected = (clientId:number) => this.onClientConnected(clientId);
        this.serverSocket.onClientDisconnected = (clientId:number) => this.onClientDisconnected(clientId);
        this.serverSocket.onClientMessage = (clientId:number, message:any) => this.onClientMessage(clientId, message);
        this.serverSocket.onClientError = (clientId:number, message:any) => this.onClientError(clientId, message);
    }

    private onClientConnected(clientId:number):void {
        console.log("onClientConnected with id " + clientId);
        this.connectClient(clientId);
    }

    private onClientDisconnected(clientId:number):void {
        console.log("onClientDisconnected with id " + clientId);
        this.disconnectClient(clientId);
    }

    private onClientError(clientId:number, message:any):void {
        console.log("onClientError with id " + clientId);
        this.disconnectClient(clientId);
    }

    private onClientMessage(clientId:number, message:any):void {
        this.network.onMessage(clientId, message);
    }

    private listen(port:string | number):void {
        console.log("Server listening on " + port);
        this.server.listen(port);
    }

    private connectClient(clientId:number):void {
        this.network.connectPeer(clientId);

        let client = new Client(clientId);
        client.playerEntity = this.world.createPlayer();
        client.state = ClientState.WaitingToJoin;
        this.clients.push(client);
    }

    private disconnectClient(clientId:number):void {
        this.network.disconnectPeer(clientId);
        this.clients.splice(this.clients.findIndex(c => c.id == clientId), 1);
    }

    private processClientMessages():void {
        let incomingPackets = this.pollpackets(this.currentTS);
        for (let incomingMessage of incomingPackets) {
            
            let client = this.clients[incomingMessage.fromId];
            // client has disconnected
            if (!client) continue;

            let bitStream = new BitStream(incomingMessage.packet);
            let packet = this.packetStream.read(bitStream, new Packet());
            client.ack = packet.ack;

            for (let message of packet.messages) {
                this.readMessage(message, incomingMessage.fromId);
            }
        }
    }

    private readMessage(message:Message, clientId:number):void {
        switch(message.type) {
            case MessageType.UserInput: {
                const userInput = message as UserInputMessage;
                this.processInput(clientId, userInput);
                break;
            }
        }
    }

    private processInput(clientId:number, userInput: UserInputMessage):void {
        let client = this.clients[clientId];
        client.ackInput = userInput.inputSequenceNumber;
        client.playerEntity.applyInput(userInput);
        
        // should physics run at every single input?
    }

    private updateClients():void {
        let numClients = this.clients.length;
        if (numClients == 0) return;
        // broadcasting state to all connected clients

        for (let i = 0; i < numClients; ++i) {
            let client = this.clients[i];
            
            if (client.state == ClientState.WaitingToJoin) {
                let joinMessage = new JoinMessage();
                joinMessage.playerEntityId = client.playerEntity.id;
                joinMessage.tickRate = this.tickRate;

                this.network.enqueueSend(client.id, joinMessage);
                client.state = ClientState.Joined;
            }
            else if (client.state == ClientState.Joined) {
                this.network.enqueueSend(client.id, this.createUpdateMessage(client));
            }
        }

        for (let client of this.clients) {
            let packet = new Packet();
            packet.seqNum = this.tickCount;
            packet.ack = client.ack;

            let buffer = this.network.getSendBuffer(client.id);
            if (!buffer || buffer.length == 0) continue;

            while (buffer.length > 0) {
                packet.messages.push(buffer.shift());         
            }

            const arrayBuf = new ArrayBuffer(4096);
            const stream = new BitStream(arrayBuf);
            this.packetStream.write(packet, stream);
            this.serverSocket.sendTo(client.id, new Uint8Array(arrayBuf, 0, stream.byteIndex));
        }
    }

    private createUpdateMessage(client:Client):UpdateMessage {
        let updateMessage = new UpdateMessage();
        updateMessage.ackInput = client.ackInput;
        updateMessage.seqNum = this.tickCount;

        let lastAckSnapshot = this.snapshots.find(s => s.seqNum == client.ack);
        let currentSnapshot = this.snapshots[this.snapshots.length - 1];

        let newInterest:Array<number> = [];
        for (let entity of this.world.entities) {
            // for now we add all entities in the interest
            newInterest.push(entity.id);
        }

        for (let entityId of newInterest) {
            let entity = this.world.entities[entityId];

            if (client.interest.indexOf(entityId) == -1) {
                // prepare full entity here and add it in the interest
                updateMessage.fullStates.push(entity.createFullState());
                client.interest.push(entity.id);
            }
            else {
                if (entity.isFixed) continue;

                // only send the compressed delta here
                let deltaState = this.getDeltaState(entity, lastAckSnapshot, currentSnapshot);
                if (deltaState.bitmask != 0) {
                    updateMessage.deltaStates.push(deltaState);
                    // console.log("adding %d for client %d", entityId, client.id);
                }
            }
        }

        return updateMessage;
    }

    private getDeltaState(entity:NetworkEntity, lastAckSnapshot:Snapshot, currentSnapshot:Snapshot):EntityState {
        const previousState = (lastAckSnapshot) ? lastAckSnapshot.entityStates.find(e => e.entityId == entity.id) : null;
        const currentState = currentSnapshot.entityStates.find(e => e.entityId == entity.id);

        let deltaEntityState = new EntityState();
        deltaEntityState.entityId = entity.id;
        for (let i = 0, l = currentState.propertyValues.length; i < l; ++i) {
            if (!previousState || currentState.propertyValues[i] != previousState.propertyValues[i]) {
                deltaEntityState.propertyValues.push(currentState.propertyValues[i]);
                deltaEntityState.propertyTypes.push(currentState.propertyTypes[i]);
                deltaEntityState.bitmask += 1 << i;
                deltaEntityState.maxBitOffset = (i + 1);
            }
        }

        return deltaEntityState;
    }

    private createSnapshot():void {
        let snapshot = new Snapshot(this.tickCount);
        this.world.entities.forEach(entity => {
            if (!entity.isFixed && (entity.isDirty || true)) {
                snapshot.entityStates.push(entity.createFullState());
                entity.cleanDirty();
            }
        });

        this.snapshots.push(snapshot);
        if (this.snapshots.length > this.maxNumSnapshots) {
            this.snapshots.shift();
        }
    }
}