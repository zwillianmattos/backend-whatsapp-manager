import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const ContactsModel = new Schema({
    id: Schema.Types.ObjectId,
    phone: String,
});


export default mongoose.model('ContactsModel', ContactsModel);