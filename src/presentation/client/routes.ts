import { Router } from 'express';
import { ClientController } from './controller';
import { AuthMiddeleware } from '../middlewares/auth.middleware';
import { ClientService } from '../services/client.service';




export class ClientRoutes {


  static get routes(): Router {

    const router = Router();
    const clientService = new ClientService();
    const controller = new ClientController(clientService);    

    // Definir las rutas
    router.get('/',  controller.getClients);
    router.post('/', [ AuthMiddeleware.validateJWT ], controller.createClient);


    return router;
  }


}

