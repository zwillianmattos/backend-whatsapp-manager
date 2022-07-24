import { Server } from "http";
import SocketIO from "socket.io";
import { Server as socketServer } from "socket.io";
import { SocketState } from "venom-bot";

import App from "../App";

export default class WebSocketService {
    private server: Server;
    private io: socketServer;
    private ws?: any;

    constructor(server: Server) {
        console.log("[WebSocketService]: Starting Service...");
        this.server = server;
        this.io = new socketServer(this.server, {
            cors: {
                origin: process.env.CORS_ORIGIN || "*"
            }
        });
        this.listeners();
    }

    public get socket(): socketServer { return this.io };

    private listeners() {
        this.ws = this.io.on('connection', (socket: SocketIO.Socket) => {
            console.log("[WebSocketService]: Connection established");
            console.log("[WebSocketService]: Socket ID: ", socket.id);
            socket.on('joinRoom', async (data) => {
                const whatsapp = App.getInstance().whatsapp?.getInstance;
                const status = await whatsapp?.isConnected();

                if (status) {
                    socket.emit('state-change', {
                        state: SocketState.CONNECTED,
                    })
                }
            });
        });
    }

    public emit(event: string, data: any) {
        this.ws.emit(event, data);
    }

    public addListener(of: string, event: string, callback: (data: any) => void) {
        this.ws.of(of).on(event, callback);
    }
}