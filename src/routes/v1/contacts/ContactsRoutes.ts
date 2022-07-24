import express, { Router } from 'express';
import MessagesController from '../../../controllers/v1/messages/MessagesController';

const contactsRouter = Router();
const controller = new MessagesController();

contactsRouter.get('/all', [], controller.getContacts);

export default contactsRouter;