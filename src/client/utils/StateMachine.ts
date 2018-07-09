class State {
    public enterListener:() => void;
    public updateListener:(delta:number) => void;
    public exitListener:() => void;

    constructor(enterListener?:() => void, updateListener?:(delta:number) => void, exitListener?:() => void) {
        this.enterListener = enterListener;
        this.updateListener = updateListener;
        this.exitListener = exitListener;
    }
}

export class StateMachine {
    private states:State[] = [];

    private currentState:State;

    public register(key:number, enterListener?:() => void, updateListener?:(delta:number) => void, exitListener?:() => void) {
        this.states[key] = new State(enterListener, updateListener, exitListener);
    }

    public changeState(key:number) {
        if (this.currentState && this.currentState.exitListener) {
            this.currentState.exitListener();
        }

        this.currentState = this.states[key];

        if (this.currentState && this.currentState.enterListener) {
            this.currentState.enterListener();
        }
    }

    public update(delta:number) {
        if (this.currentState && this.currentState.updateListener) {
            this.currentState.updateListener(delta);
        }
    }
}