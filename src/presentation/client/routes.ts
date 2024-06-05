import { Router } from 'express';
import { ClientController } from './controller';




export class ClientRoutes {


  static get routes(): Router {

    const router = Router();
    const controller = new ClientController();    

    // Definir las rutas
    router.post('/', controller.createClient);
    router.get('/', controller.getClients);



    return router;
  }


}

