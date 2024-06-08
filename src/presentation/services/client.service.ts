import { ClientModel } from "../../data";
import { CreateClientDto, CustomError, PaginationDto, UserEntity } from "../../domain";

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

    async getClients( paginationDto : PaginationDto) {

        const { page, limit } = paginationDto;


        try {

            // const total = await ClientModel.countDocuments();
            // const clients = await ClientModel.find()
            //     .skip( ( page - 1 ) * limit)
            //     .limit ( limit )

            const [total, clients] = await Promise.all([
                await ClientModel.countDocuments(),
                ClientModel.find()
                .skip( ( page - 1 ) * limit)
                .limit ( limit )  
            ])

            return {
                page: page,
                limit: limit,
                total: total,
                next: `/api/clients?page=${ (page +1) }$limit=${ limit}`,
                prev: (page -1 > 0) ?`/api/clients?page=${ (page -1) }$limit=${ limit}`: null,
             

                clients: clients.map( client => ({
                    id: client.id,
                    name: client.name,
                    address: client.address,
                    email: client.email,
                    phone: client.phone,
                }))
            }
            
        } catch (error) {
            throw CustomError.internalServer('Internal Server Error')

        }

    }
}