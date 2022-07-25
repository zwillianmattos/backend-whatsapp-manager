import { Server } from "http";
import { create, Whatsapp, CreateOptions, CatchQR, SocketState, } from 'venom-bot';
import WebSocketService from "./WebSocketService";

import App from "../App";

export default class WhatsappService {
    private server: Server;
    private websocketService: WebSocketService;
    private instance?: Whatsapp;


    constructor(server: Server, websocketService: WebSocketService) {
        console.log("[WhatsappService]: Starting Service...");
        this.server = server;
        this.websocketService = websocketService;
        this.init();
    }

    private async init() {
        try {
            const createOptions: CreateOptions = {
                catchQR: this._catchQR,
                statusFind: this._statusFind,
                session: 'clientbarbeariasantosete',
                headless: true,
                devtools: false,
                useChrome: false,
                debug: false,
                logQR: true,
                disableSpins: true,
                disableWelcome: true,
                mkdirFolderToken: '',
                folderNameToken: 'tokens_whatsapp',
                // browserWS: '',
                rowserArgs: [''],
                refreshQR: 3000,
                autoClose: 0,
                defaultViewport: null,
                puppeteerOptions: [
                    "--incognito",
                    "--single-process",
                    "--no-zygote", 
                    "--no-sandbox", 
                    "--disabled-setupid-sandbox", 
                    '--disable-setuid-sandbox',],
                multidevice: true,
            } as CreateOptions;
            const instance = await create(createOptions)

            this._listeners(instance);
        } catch (e) {
            console.error(e)
        }
    }

    private _listeners(whatsapp: Whatsapp) {
        this.instance = whatsapp;

        // Recebimento de mensagens
        this.instance!.onAck(ack => {
            // console.log(ack);
        });

        // Listener mensagem
        this.instance!.onMessage((message) => {
            // console.log(message);
            this.websocketService.emit("message", message);
        });

        // Alteração de estado
        this.instance!.onStateChange((state) => {
            const conflits = [
                SocketState.CONFLICT,
                SocketState.UNPAIRED,
                SocketState.UNLAUNCHED,
            ];

            if (conflits.includes(state)) {
                whatsapp.useHere();
            }

            App.getInstance().io.socket.emit("state-change", {
                state: state,
            });
        });


        this.instance?.close();
    }

    private _catchQR(qrCode: string, asciiQR: string, attempt: number, urlCode?: string) {
        console.log(qrCode, asciiQR, attempt, urlCode);

        App.getInstance().io.socket.emit("connect-whatsapp", {
            qrCode,
            asciiQR,
            attempt
        });
    }

    private _statusFind(statusGet: string, session: string) {
        console.log(statusGet, session);

        App.getInstance().io.socket.emit("state-change", {
            state: SocketState.CONNECTED,
            session: session,
        });
    }

    public get getInstance(): Whatsapp | undefined {
        return this.instance;
    }


}
