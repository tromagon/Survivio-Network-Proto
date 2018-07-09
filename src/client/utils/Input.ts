export class Input {
    private downKeys: Array<number> = new Array<number>();

    constructor() {
        window.addEventListener("keydown", (event) => this.onKeyDown(event));
        window.addEventListener("keyup", (event) => this.onKeyUp(event));
    }

    public isKeyDown(keyCode:number):boolean {
        return this.downKeys.indexOf(keyCode) !== -1;
    }

    private onKeyDown(event:KeyboardEvent) {
        if (this.downKeys.indexOf(event.keyCode) === -1) {
            this.downKeys.push(event.keyCode);
        }
    }

    private onKeyUp(event:KeyboardEvent) {
        if (this.downKeys.indexOf(event.keyCode) === -1) return;
        this.downKeys.splice(this.downKeys.indexOf(event.keyCode), 1);
    }
}