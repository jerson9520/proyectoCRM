import { Router } from 'express';
import { ClientController } from './controller';
import { AuthMiddeleware } from '../middlewares/auth.middleware';




export class ClientRoutes {


  static get routes(): Router {

    const router = Router();
    const controller = new ClientController();    

    // Definir las rutas
    router.get('/',  controller.getClients);
    router.post('/', [ AuthMiddeleware.validateJWT ], controller.createClient);

   



    return router;
  }


}

