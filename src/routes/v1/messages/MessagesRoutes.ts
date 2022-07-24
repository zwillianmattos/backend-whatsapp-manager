import express, { Router } from 'express';
import MessagesController from '../../../controllers/v1/messages/MessagesController';

const messagesRouter = Router();
const controller = new MessagesController();

messagesRouter.post('/cron', [], controller.getContacts);

messagesRouter.get('/agendados', [], controller.getAgendados);

messagesRouter.post('/addAgenda', [], controller.addAgenda);

export default messagesRouter;