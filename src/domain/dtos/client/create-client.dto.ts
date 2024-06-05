// domain/CreateClientDto.js

export class CreateClientDto {
    private constructor(
        public readonly name: string,
        public readonly address: string,
        public readonly email: string,
        public readonly phone: string,
    ) {}

    static create(object: { [key: string]: any}): [string?, CreateClientDto?] {

        const {name, address, email, phone} = object;
        
        if ( !name ) return ['Missing Name'];
        if ( !address ) return ['Missing Addres'];
        if ( !email ) return ['Missing Email'];
        if ( !phone ) return ['Missing Phone'];

        return [undefined, new CreateClientDto(name, address, email, phone)];
    }

}
