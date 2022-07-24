import { Router } from 'express';
import messagesRouter from './messages/MessagesRoutes';

import contactsRouter from './contacts/ContactsRoutes';

const routes = Router();

routes.use('/messages', messagesRouter);
routes.use('/contacts', contactsRouter);

export default routes;