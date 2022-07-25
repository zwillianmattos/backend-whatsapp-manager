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
                origin: "*"
            }
        });

        this.listeners();
    }

    public get socket(): socketServer { return this.io };

    private listeners() {
        this.ws = this.io.on('connection', (socket: SocketIO.Socket) => {
            console.log("[WebSocketService]: Connection established");
            console.log("[WebSocketService]: Socket ID: ", socket.id);

            socket.on('disconnectWhatsApp', async () => {
                const whatsapp = App.getInstance().whatsapp?.getInstance;
                await whatsapp?.logout();
                const status = await whatsapp?.isConnected();
                socket.emit('state-change', {
                    state: status ? 'CONNECTED' : 'DISCONECTED',
                    qr: await whatsapp?.getQrCode()
                })
            })
            socket.on('connectWhatsApp', async () => {
                const whatsapp = App.getInstance().whatsapp?.getInstance;
                await whatsapp?.restartService();
                const status = await whatsapp?.isConnected();
                socket.emit('state-change', {
                    state: status ? 'CONNECTED' : 'DISCONECTED',
                    qr: await whatsapp?.getQrCode()
                })
            })
            socket.on('joinRoom', async (data) => {
                const whatsapp = App.getInstance().whatsapp?.getInstance;
                const status = await whatsapp?.isConnected();

                if (status) {
                    socket.emit('state-change', {
                        state: status ? 'CONNECTED' : 'DISCONECTED',
                    })
                } else {
                    socket.emit('state-change', {
                        state: status ? 'CONNECTED' : 'DISCONECTED',
                        qr: await whatsapp?.getQrCode()
                    })

                }
            });

            socket.on('enviarMensagem', async (data) => {
                const whatsapp = App.getInstance().whatsapp?.getInstance;
                await whatsapp?.initialize();
                await whatsapp?.sendText(data.to, data.msg);

                // await whatsapp?.sendImage(
                //     data.to,
                //     'https://res.cloudinary.com/dxz4ivhm8/image/upload/v1631622812/barbearia-santo-sete/208892539_1009499919816634_1891864338405063903_n.jpg',
                //     '208892539_1009499919816634_1891864338405063903_n.jpg',
                //     data.msg);
            })
        });
    }


    public emit(event: string, data: any) {
        this.ws.emit(event, data);
    }

    public addListener(of: string, event: string, callback: (data: any) => void) {
        this.ws.of(of).on(event, callback);
    }
}