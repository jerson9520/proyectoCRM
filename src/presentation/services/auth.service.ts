import { UserModel } from "../../data";
import { CustomError, RegisterUSerDto, UserEntity } from "../../domain";

export class AuthService  {


    constructor(){}


    public async registerUser(registerUserDto: RegisterUSerDto) {

        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if (existUser) throw CustomError.badRequest('Email already exist');

        try {
          const user = new UserModel(registerUserDto);
          await user.save(); // para que guarde en la base de datos  

          // encriptar la contaseña

          //jwt para mantener la autenticacion del usuario


          // email de confirmacion 


          const { password, ...userEntity} = UserEntity.fromObject(user);

          return { 
            user: userEntity,
            token: 'ABC'
        };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}