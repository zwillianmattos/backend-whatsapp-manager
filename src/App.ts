import cors from "cors";
import express, { Express } from "express";
import { createServer, Server } from "http";
import { IDatabase } from "./interfaces/IDatabase";
import { CronService } from "./services/Cron";
import MongodbService from "./services/Mongodb";

import WebSocketService from "./services/WebSocketService";
import WhatsappService from "./services/WhatsappService";

class App {
    public app: express.Application;
    public server: Server;
    public io: WebSocketService;
    public whatsapp?: WhatsappService;
    public db?: IDatabase;
    public cron?: CronService;

    private static instance: App;

    public static getInstance(): App {
        if (!App.instance) {
            App.instance = new App();
        }

        return App.instance;
    }

    private constructor() {
        this.app = express();

        const allowedOrigins = ['localhost:9000','app.barbeariasantosete.com.br', 'http://app.barbeariasantosete.com.br', '*'];

        const options: cors.CorsOptions = {
            origin: '*'
        };

        
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(cors())
        
        this.server = createServer(this.app);
        this.io = new WebSocketService(this.server);
        this.whatsapp = new WhatsappService(this.server, this.io);
        // this.db = new MongodbService();
        // this.cron = CronService.getInstance();
    }
}

export default App;