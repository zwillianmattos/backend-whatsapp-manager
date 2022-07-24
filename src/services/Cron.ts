const CronJob = require('cron').CronJob;

import MessagesRepository from "../repositories/MessagesRepository";
import ContactsRepository from "../repositories/ContactsRepository";
import WhatsappService from "../services/WhatsappService";
import moment from "moment";

import App from "../App";
import { Chat } from "venom-bot";

export class CronService {

    private static instance?: CronService;

    private cron: any;
    constructor() {

    }

    public static getInstance(): CronService {
        try {
            if (!this.instance) {
                this.instance = new CronService();
                this.instance.start();
            }

            return this.instance;
        } catch (e) {
            throw ("Ocorreu um erro interno, tente novamente em instantes");
        }
    }

    public async start() {
        // 23 9 14 * *
        // 56 9 15/30 * *
        this.cron = new CronJob('* * * * *', () => {
            console.log("[Cron]: Running ");
            new MessagesRepository().getAllCrons().then((crons: Array<any>) => {

                crons.forEach((cron: any) => {
                    cron?.contacts?.map(async (contact: any) => {
                        // Busca o contato
                        let contactData = await new ContactsRepository().getById(contact);

                        const WhatsApp = App.getInstance().whatsapp?.getInstance;

                        console.log(contactData.phone);
                        // Acessa o chat                
                        let chat: Chat | undefined = await WhatsApp?.getChatById(contactData.phone);

                        if (typeof chat !== "undefined" && chat != null) {

                            console.log("[Cron]: Enviando mensagem para " + contactData.phone);

                            // Se for, envia mensagem
                            WhatsApp?.sendText(contactData?.phone, cron.message);

                            // WhatsApp?.sendImage(
                            //     contactData?.phone, 
                            //     'https://res.cloudinary.com/dxz4ivhm8/image/upload/v1631622812/barbearia-santo-sete/208892539_1009499919816634_1891864338405063903_n.jpg', 
                            //     '208892539_1009499919816634_1891864338405063903_n.jpg',
                            //     cron.message);

                            // Se estiver marcado pra nao repetir, remove a mensagem
                            if (cron.repeat == false) {
                                // remove a programação
                                await new MessagesRepository().deleteMany(cron._id).then(async () => {
                                    // Remove os contatos
                                    await new ContactsRepository().deleteMany(contact);
                                });
                            }

                            // // Pega a data da ultima interação
                            // let lastAction = moment(parseInt(chat.t + "000"));
                            // console.log("[Cron]: Last action: " + lastAction.format("DD/MM/YYYY HH:mm:ss"));


                            // console.log("[Cron]: Hora atual: " + moment().format("DD/MM/YYYY HH:mm:ss"));

                            // console.log(lastAction.add(cron.dias, 'days'), lastAction.add(cron.dias, 'days').isSameOrBefore(moment()))

                            // // Verifica se a data da ultima alteração + os dias cadastrados é menor ou igual a hoje
                            // if (lastAction.add(cron.dias, 'days').isSameOrBefore(moment())) {

                            //     var format = 'hh:mm:ss'

                            //     // var time = moment() gives you current time. no format required.
                            //     var time = moment(moment(), format),
                            //         beforeTime = moment('08:00:00', format),
                            //         afterTime = moment('18:00:00', format);

                            //     if (time.isBetween(beforeTime, afterTime)) {

                            //         console.log('[Horario Comercial]: Sim')


                            //     } else {
                            //         console.log('[Horario Comercial]: Nao')
                            //     }
                            // }
                        }

                    });
                });
            });

        }, null, true, 'America/Sao_Paulo');
        this.cron.start();
    }

    public stop() {
        this.cron.stop();
    }

}