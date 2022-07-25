import { Router } from 'express';
import messagesRouter from './messages/MessagesRoutes';

import contactsRouter from './contacts/ContactsRoutes';

const routes = Router();

routes.use('/messages', messagesRouter);
routes.use('/contacts', contactsRouter);
routes.post('/auth', [], (req: any, res: any) => {
    console.log(req);
    const { email, password } = req.body;
    console.log(req.body);
    if (email == 'sergio@barbeariasanto7.com' && password == 'sergiogagliani') {
        res.send({
            status: true,
            msg: 'Login efetuado com sucesso'
        });
    } else {
        res.status(500).send({
            status: false,
            msg: 'Usuario ou senha invalidos'
        })
    }
});
export default routes;