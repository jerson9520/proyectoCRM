// domain/UpdateClientDto.js

export class UpdateClientDto {
    constructor(
        public readonly name?: string,
        public readonly address?: string,
        public readonly email?: string,
        public readonly phone?: string,
    ) {}
}
