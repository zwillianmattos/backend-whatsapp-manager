import mongoose from 'mongoose'
import { IDatabase } from '../interfaces/IDatabase';
import dotenv from "dotenv";

export default class MongodbService implements IDatabase {

    private instance?: MongodbService;

    constructor() {
        dotenv.config();
        this.instance = this;
        this.connect();
    }

    async connect(): Promise<void> {
        mongoose.connect(process.env.MONGODB_URI || "").then((connection) => {
            console.log("Mongodb connected");
        }).catch((err) => {
            console.log(err);
        });
    }

    async disconnect(): Promise<void> {
        return mongoose.disconnect();
    }

    public getConnection(): mongoose.Connection {
        return mongoose.connection;
    }

    public get getInstance(): MongodbService {
        try {
            return this.instance!;
        } catch (e) {
            throw ("Ocorreu um erro interno, tente novamente em instantes");
        }
    };

}