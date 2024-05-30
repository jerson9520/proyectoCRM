import { JwtAdapter, bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUSerDto, UserEntity } from "../../domain";

export class AuthService  {


    constructor(){}


    public async registerUser(registerUserDto: RegisterUSerDto) {

        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if (existUser) throw CustomError.badRequest('Email already exist');

        try {
          const user = new UserModel(registerUserDto);
          
          // encriptar la contaseña
          user.password = bcryptAdapter.hash( registerUserDto.password);
          await user.save(); // para que guarde en la base de datos 
          
          
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

    public async loginUser ( loginUserDto: LoginUserDto) {

        //findone para verificar si existe
        const user = await UserModel.findOne({ email: loginUserDto.email });
        if (!user) throw CustomError.badRequest('Email not exist');

        //isMatch... bycryp compaer(password, fsadfsdfge8df78dfgs)
        const isMatching = bcryptAdapter.compare( loginUserDto.password, user.password );
        if (!isMatching) throw CustomError.badRequest('Password is not valid');

        const {password, ...userEntity} = UserEntity.fromObject( user );


        const token = await JwtAdapter.generateToken({ id:user.id, email:user.email});
        if ( !token ) throw CustomError.internalServer('Error While creating JWT');

        return {
            user: userEntity,
            token: token,
        }
    }
}