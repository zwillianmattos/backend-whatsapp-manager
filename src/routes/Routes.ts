import { Router, Request, Response } from 'express';
import v1 from './v1/v1';

const routes = Router();

routes.use('/api/v1', v1);

routes.get('/version', (request: Request, response: Response) => {
    const { APP_VERSION } = process.env
    response.status(200).json({ api_version: APP_VERSION })
});

export default routes;