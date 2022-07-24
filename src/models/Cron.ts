
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CronModel = new Schema({
    id: Schema.Types.ObjectId,
    message: String,
    repeat: Boolean,
    contacts: [{ type: Schema.ObjectId, ref: 'Contacts' }],
    dias: Number,
    data_criacao: Date,
    data_atualizacao: Date
});

export default mongoose.model('CronModel', CronModel);