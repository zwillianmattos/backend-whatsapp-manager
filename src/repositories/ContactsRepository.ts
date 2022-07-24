import mongoose from 'mongoose'
import App from "../App";
import ContactsModel from "../models/Contact";

export default class ContactsRepository {
    private _connection?: mongoose.Connection;

    constructor() {
        this._connection = App.getInstance().db?.getConnection();
    }

    public async getAllContacts(): Promise<any> {
        return new Promise((resolve, reject) => {
            ContactsModel.find({}, (err: any, docs: any) => {
                if (err) {
                    console.log(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

    public async getById(id: string): Promise<any> {
        return new Promise((resolve, reject) => {
            ContactsModel.findById(id, (err: any, doc: any) => {
                if (err) {
                    console.log(err);
                } else {
                    resolve(doc);
                }
            });
        });
    }

    public async deleteMany(ids: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            ContactsModel.deleteMany({ _id: { $in: ids } }, (err: any) => {
                if (err) {
                    console.log(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

}