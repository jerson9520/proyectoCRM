import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUSerDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";

export class AuthService  {


    constructor(
        private readonly emailService: EmailService,
    ){}


    public async registerUser(registerUserDto: RegisterUSerDto) {

        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if (existUser) throw CustomError.badRequest('Email already exist');

        try {
          const user = new UserModel(registerUserDto);
          
          // encriptar la contaseña
          user.password = bcryptAdapter.hash( registerUserDto.password);
          await user.save(); // para que guarde en la base de datos 

          // email de confirmacion 
          await this.sendEmailValidationLink( user.email );

          //jwt para mantener la autenticacion del usuario
          const { password, ...userEntity} = UserEntity.fromObject(user);

          const token = await JwtAdapter.generateToken({ id:user.id, email:user.email});
          if ( !token ) throw CustomError.internalServer('Error While creating JWT');
  

          return { 
            user: userEntity,
            token: token,
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

    private sendEmailValidationLink = async ( email: string ) => {

        const token = await JwtAdapter.generateToken({ email });
            if( !token ) throw CustomError.internalServer('Error getting token');
        
        const link = `${ envs.WEBSERVICE_URL}/auth/validate-email/${ token }`;
        const html = `
            <h1>Validate your email</h1>
            <p>Click on the following link to validate your email</p>
            <a href="${ link }">Validate your email: ${email}</a>
            <p>If you did not create an account, please ignore this email.</p>
        `;
        
        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html, 
        }

        const isSent = await this.emailService.sendEmail( options );
        if(!isSent ) throw CustomError.internalServer('Error sending email');

        return true;
    }

    public validateEmail = async( token: string ) => {

        const payload = await JwtAdapter.validateToken(token);
        if(!payload) throw CustomError.unauthorized('Token not valid');

        const {email } = payload as {email: string};
        if (!email) throw CustomError.internalServer('Email not in token')

        const user = await UserModel.findOne({ email });
        if ( !user ) throw CustomError.internalServer('Email not exist');   

        user.emailValidated = true;
        await user.save();

        return true;
    }
}