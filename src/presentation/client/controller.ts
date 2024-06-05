import { Request, Response } from "express";
import { CreateClientDto, CustomError } from "../../domain";

export class ClientController {


    constructor () {

    }

    
    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError){
            return res.status(error.statusCode).json({error: error.message});
        }
        console.log(`${error}`)
        return res.status(500).json({ error: 'Internal server error'})
    }

    createClient = async(req: Request, res: Response) => {
        const [error, createClientDto] =  CreateClientDto.create( req.body);
        if (error ) return res.status(400).json({error});
        res.json(createClientDto)
    }

    getClients = async(req: Request, res: Response) => {  
        res.json('get Clients')
    }

}