import { Server as socketServer } from "socket.io";
import { Whatsapp } from "venom-bot";
import App from "../App";

export default class Controller {
    protected app: App;

    constructor() {
        this.app = App.getInstance();
    }

    protected get getApp(): App {
        return this.app;
    }

    protected getWhatsApp(): Whatsapp | undefined {
        try {
            return App.getInstance().whatsapp?.getInstance;
        } catch (e) {
            throw (e);
        }

    };

    protected getWS(): socketServer { return App.getInstance().io.socket; }
}