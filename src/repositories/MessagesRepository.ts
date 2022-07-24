import { ObjectId } from 'mongodb';
import mongoose from 'mongoose'
import App from "../App";
import ContactsModel from "../models/Contact";
import CronModel from "../models/Cron";

export default class MessagesRepository {
    private _connection?: mongoose.Connection;

    constructor() {
        this._connection = App.getInstance().db?.getConnection();
    }

    public async getAllCrons(): Promise<any> {
        return new Promise((resolve, reject) => {
            CronModel.find({}, (err: any, docs: any) => {
                if (err) {
                    console.log(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

    public async deleteMany(ids: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            CronModel.deleteMany({ _id: { $in: ids } }, (err: any) => {
                if (err) {
                    console.log(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    public async saveCron(message: string, dias: number, repeat: boolean, contacts: Array<string>): Promise<any> {


        const saveContacts = (contacts: Array<string>): Promise<Array<ObjectId>> => {

            return new Promise(async (resolve, reject) => {
                var contatosVinculados: Array<Promise<any>> = [];

                contacts.forEach(async (contact: any) => {
                    var obj = new ContactsModel({
                        phone: contact
                    });
                    contatosVinculados.push(obj.save());
                });

                Promise.all(contatosVinculados).then(async (contacts: any) => {
                    console.log(contacts);
                    resolve(contacts);
                });
            });
        };

        const cron = new CronModel({
            message: message,
            dias: dias,
            repeat: repeat,
            contacts: await saveContacts(contacts)
        });

        cron.save((err: any) => {
            if (err) {
                console.log(err);
                return false;
            } else {
                return true;
            }
        });
    }

}