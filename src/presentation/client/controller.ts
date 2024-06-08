import { Request, Response } from "express";
import { CreateClientDto, CustomError, PaginationDto } from "../../domain";
import { ClientService } from "../services/client.service";

export class ClientController {


    constructor (
        private readonly clientService: ClientService,
    ) {}

    
    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError){
            return res.status(error.statusCode).json({error: error.message});
        }
        console.log(`${error}`)
        return res.status(500).json({ error: 'Internal server error'})
    }

    createClient = (req: Request, res: Response) => {
        const [error, createClientDto] =  CreateClientDto.create( req.body);
        if (error ) return res.status(400).json({error});
        
        this.clientService.createClient(createClientDto!, req.body.user )
            .then( client => res.status(201).json(client))
            .catch( error => this.handleError( error, res ));
    }

    getClients = (req: Request, res: Response) => {  

        const { page= 1, limit= 10} = req.query;
        const [ error, paginationDto] = PaginationDto.create( +page, +limit);
            if ( error ) return res.status(400).json({ error});
        
        this.clientService.getClients( paginationDto!)
            .then( clients => res.json( clients ))
            .catch( error => this.handleError( error, res ));
    }



}