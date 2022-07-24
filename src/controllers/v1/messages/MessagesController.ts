import express from "express";
import App from "../../../App";
import { Whatsapp } from "venom-bot";
import Controller from "../../Controller";
import MessagesRepository from "../../../repositories/MessagesRepository";

export default class MessagesController extends Controller {
    constructor() {
        super();
    }

    public async getContacts(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction) {
        try {

            response.status(200).json(await super.getWhatsApp()?.getAllContacts());
        } catch (e) {
            response.status(500).json({
                status: false,
                message: e || "Ocorreu um erro interno, tente novamente em instantes"
            })
        }
    }

    public async getConversation(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction) {
        try {

            response.status(200).json(await super.getWhatsApp()?.getAllChatsWithMessages());
        } catch (e) {
            response.status(500).json({
                status: false,
                message: e || "Ocorreu um erro interno, tente novamente em instantes"
            })
        }
    }

    public async getAllChats(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction) {
        try {
            response.status(200).json(await super.getWhatsApp()?.getAllChats());
        } catch (e) {
            response.status(500).json({
                status: false,
                message: e || "Ocorreu um erro interno, tente novamente em instantes"
            })
        }
    }

    public async createGrounp(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction) {

        try {
            response.status(200).json(await super.getWhatsApp()?.createGroup(
                "Grupo de teste",
                [
                    "5514996461384@c.us"
                ]
            ));
        } catch (e) {
            response.status(500).json({
                status: false,
                message: e || "Ocorreu um erro interno, tente novamente em instantes"
            })
        }
    }


    public async getAgendados(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction) {
        try {
            var data = await new MessagesRepository().getAllCrons();

            response.status(200).json(data);
        } catch (e) {
            console.log(e);
            response.status(500).json({
                status: false,
                message: e || "Ocorreu um erro interno, tente novamente em instantes"
            })
        }
    }

    public async addAgenda(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        try {

            const { 
                message,
                dias,
                repeat,
                contacts
            } = request.body;


            var data = await new MessagesRepository().saveCron(
                message,
                dias,
                repeat,
                contacts,
            );

            response.status(200).json({
                status: true,
                message: "Agendado com sucesso"
            });
        } catch (e) {
            console.log(e);
            response.status(500).json({
                status: false,
                message: e || "Ocorreu um erro interno, tente novamente em instantes"
            })
        }
    }
}