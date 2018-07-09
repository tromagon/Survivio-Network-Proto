export abstract class Message {
    private _type:number;
    public get type():number {
        return this._type;
    }

    constructor(type:number) {
        this._type = type;
    }
}