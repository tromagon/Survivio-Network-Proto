import { Context } from "./Context";
import { Graphics } from "pixi.js";
import { GameContext } from "./GameContext";
import { StateMachine } from "../utils/StateMachine";

const SERVER_URL = 'ws://localhost:8080';

enum LobbyState {
    Idle,
    ConnectionRequest
}

export class LobbyContext extends Context {
    public static readonly ID = "Lobby.ID";

    private joinButton:Graphics;
    private states:StateMachine;

    public enter():void {
        // show join button

        this.joinButton = new Graphics();
        this.joinButton.beginFill(0xff000);
        this.joinButton.drawRect(0, 0, 100, 40);
        this.joinButton.endFill();

        this.joinButton.x = window.innerWidth / 2 - this.joinButton.width / 2;
        this.joinButton.y = window.innerHeight / 2 - this.joinButton.height / 2;

        this.joinButton.interactive = true;
        this.joinButton.buttonMode = true;

        this.joinButton.on("mousedown", (e) => this.jointButtonClicked(e), this);

        this.gameApplication.stage.addChild(this.joinButton);
    }

    public update(delta:number) {
        // this.states.update(delta);
    }

    private jointButtonClicked(event:any):void {
        // this.joinButton.interactive = false;
        // this.joinButton.buttonMode = false;
        // this.joinButton.removeAllListeners();

        // this.states.changeState(LobbyState.ConnectionRequest);

        this.startGame();
    }

    private startGame() {
        this.gameApplication.stage.removeChild(this.joinButton);
        this.gameApplication.changeContext(GameContext.ID);
    }
}