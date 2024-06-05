import { ClientModel } from "../../data";
import { CreateClientDto, CustomError, UserEntity } from "../../domain";

export class ClientService {
    constructor(){} 


    async createClient( createClientDto: CreateClientDto, user: UserEntity){

        const clientExist = await ClientModel.findOne({ name: createClientDto.name});
        if(clientExist) throw CustomError.badRequest( 'Client already exist' );

        try {
            
            const client = new ClientModel({
                ...createClientDto,
                user: user.id,
            })

            await client.save();

            return {
                id: client.id,
                name: client.name,
                email: client.email,
                addres: client.address,
                phone: client.phone,
            }

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getClients() {

        try {
            const clients = await ClientModel.find();

            return clients.map( client => ({
                id: client.id,
                name: client.name,
                address: client.address,
                email: client.email,
                phone: client.phone,
            }))
            
        } catch (error) {
            throw CustomError.internalServer('Internal Server Error')

        }

    }
}