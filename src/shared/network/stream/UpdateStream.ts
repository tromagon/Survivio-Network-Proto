import { UpdateMessage } from "../messages/UpdateMessage";
import { Stream } from "./Stream";
import { BitStream } from "bit-buffer";
import { EntityState } from "../core/EntityState";
import { BitPropertyType } from "../core/BitProperty";

export class UpdateStream implements Stream<UpdateMessage> {
    public read(src:BitStream, dest:UpdateMessage):UpdateMessage {
        dest.seqNum = src.readUint32();
        dest.ackInput = src.readUint32();

        let numStates = src.readUint8();
        for (let i = 0 ; i < numStates; ++i) {
            let entityState = new EntityState();
            entityState.entityId = src.readUint16();
            entityState.type = src.readUint8();
            this.readProperties(src, entityState);
            dest.fullStates.push(entityState);
        }

        numStates = src.readUint8();
        for (let i = 0 ; i < numStates; ++i) {
            let entityState = new EntityState();
            entityState.entityId = src.readUint16();
            this.readProperties(src, entityState);
            dest.deltaStates.push(entityState);
        }

        return dest;
    }

    public write(src:UpdateMessage, dest:BitStream):any {
        dest.writeUint32(src.seqNum);
        dest.writeUint32(src.ackInput);

        let numStates = src.fullStates.length;
        dest.writeUint8(numStates);

        for (let i = 0 ; i < numStates; ++i) {
            let entityState = src.fullStates[i];
            dest.writeUint16(entityState.entityId);
            dest.writeUint8(entityState.type);
            this.writeProperties(entityState, dest);
        }

        numStates = src.deltaStates.length;
        dest.writeUint8(numStates);
        for (let i = 0 ; i < numStates; ++i) {
            let entityState = src.deltaStates[i];
            dest.writeUint16(entityState.entityId);
            this.writeProperties(entityState, dest);
        }

        return dest;
    }

    private readProperties(src:BitStream, entityState:EntityState) {
        const numProperties = src.readUint8();
        entityState.maxBitOffset = src.readUint8();
        entityState.bitmask = src.readBits(entityState.maxBitOffset);
        for (let i = 0 ; i < numProperties; ++i) {
            const type = src.readUint8();
            entityState.propertyTypes.push(type);
            entityState.propertyValues.push(this.readProperty(src, type));
        }
    }

    private writeProperties(entityState:EntityState, dest:BitStream):void {
        const numProperties = entityState.propertyValues.length;
        dest.writeUint8(numProperties);
        dest.writeUint8(entityState.maxBitOffset);
        dest.writeBits(entityState.bitmask, entityState.maxBitOffset);
        for (let i = 0; i < numProperties; ++i) {
            const type = entityState.propertyTypes[i];
            dest.writeUint8(type);
            this.writeProperty(type, entityState.propertyValues[i], dest);
        }
    }

    private readProperty(src:BitStream, type:BitPropertyType):any {
        let value:any;
        switch (type) {
            case BitPropertyType.uint8: {
                value = src.readUint8();
                break;
            }

            case BitPropertyType.uint16: {
                value = src.readUint16();
                break;
            }

            case BitPropertyType.uint32: {
                value = src.readUint32();
                break;
            }

            case BitPropertyType.int8: {
                value = src.readInt8();
                break;
            }

            case BitPropertyType.int16: {
                value = src.readInt16();
                break;
            }

            case BitPropertyType.int32: {
                value = src.readInt32();
                break;
            }

            case BitPropertyType.float32: {
                value = src.readFloat32();
                break;
            }

            case BitPropertyType.float64: {
                value = src.readFloat64();
                break;
            }

            case BitPropertyType.string: {
                value = src.readASCIIString();
                break;
            }

            case BitPropertyType.bool: {
                value = src.readBoolean();
                break;
            }
        }

        return value;
    }

    private writeProperty(type:number, value:any, dest:BitStream) {
        switch (type) {
            case BitPropertyType.uint8: {
                dest.writeUint8(value);
                break;
            }

            case BitPropertyType.uint16: {
                dest.writeUint16(value);
                break;
            }

            case BitPropertyType.uint32: {
                dest.writeUint32(value);
                break;
            }

            case BitPropertyType.int8: {
                dest.writeInt8(value);
                break;
            }

            case BitPropertyType.int16: {
                dest.writeInt16(value);
                break;
            }

            case BitPropertyType.int32: {
                dest.writeInt32(value);
                break;
            }

            case BitPropertyType.float32: {
                dest.writeFloat32(value);
                break;
            }

            case BitPropertyType.float64: {
                dest.writeFloat64(value);
                break;
            }

            case BitPropertyType.string: {
                dest.writeASCIIString(value);
                break;
            }

            case BitPropertyType.bool: {
                dest.writeBoolean(value);
                break;
            }
        }
    }
}