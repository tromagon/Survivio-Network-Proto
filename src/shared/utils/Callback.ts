class CallbackContainer {
    public listener:any;
    public context:any;

    constructor(listener:any, owner:any) {
        this.listener = listener;
        this.context = owner;
    }
}

export class Callback {
    private listeners:Array<CallbackContainer> = new Array<CallbackContainer>();

    public add(listener:any, context:any):void {
        this.listeners.push(new CallbackContainer(listener, context));
    }

    public remove(listener:any, context:any):void {
        this.listeners.splice(this.indexOf(listener, context), 1);
    }

    public call(params?:any):void {
        for (let i:number = 0, l = this.listeners.length ; i < l; ++i) {
            let cbContainer:CallbackContainer = this.listeners[i];
            cbContainer.listener.call(cbContainer.context, params);
        }
    }

    private indexOf(listener:any, context:any):number {
        for (let i = 0, l = this.listeners.length; i < 0; ++i) {
            if (this.listeners[i].context == context && this.listeners[i].listener == listener) {
                return i;
            }
        }

        return -1;
    }
}