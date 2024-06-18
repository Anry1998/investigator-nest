import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'
import { User } from 'src/users/users.model';
import { TokenService } from './token.service';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
                private tokenService: TokenService) {}

    async registration(userDto: CreateUserDto) {
        const condidate = await this.userService.getUserByEmail(userDto.email)
        if (condidate) {
            throw new HttpException(`Пользователь с таким email: ${userDto.email} уже существует`, HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5)
        const user = await this.userService.createUser({...userDto, password: hashPassword})
        // Сокращаю объект user, чтобы уменьшить размер токена
        const reduceUser = await this.userService.reduceUser(user.email)
        const tokens = await this.tokenService.generateTokens(reduceUser)
        await this.tokenService.saveRefreshToken(user.id, tokens.refreshToken)

        return {...tokens}
    }
    
    async login( userDto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email)
        if (!user) {
            throw new HttpException(`Пользователь с email: ${userDto.email} не был найден`, HttpStatus.BAD_REQUEST)
        }

        const isPassEquals = await bcrypt.compare(userDto.password, user.password)
        if (!isPassEquals) {
            throw new HttpException(`Введен неверный пароль`, HttpStatus.BAD_REQUEST)
        }

        const reduceUser = await this.userService.reduceUser(user.email)
        const tokens = await this.tokenService.generateTokens(reduceUser)
        await this.tokenService.saveRefreshTokenAfterRegistration(user.id,  tokens.refreshToken)

        // const user = await this.validateUser(userDto)
        return  {...tokens}
    }

    async logout(refreshToken) {
        const token = await this.tokenService.removeRefreshToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {

        if (!refreshToken) {
            throw new HttpException('Токен отсутствует', HttpStatus.FORBIDDEN)
        }
        // Валидируем токен, если он валиден, то на выходе получаем заложенный в него объект
        const userData = await this.tokenService.validateRefreshToken(refreshToken)
        // Ищем в БД токен  
        const tokenFromDb = await this.tokenService.findRefreshToken(refreshToken)
        
        if (!userData || !tokenFromDb) {
            throw new HttpException('Ошибка авторизации', HttpStatus.FORBIDDEN)
        }
        // Если все ок, ищем в БД пользователя
        // const user = await this.userService.getUserByEmail(userData.email)
        const reduceUser = await this.userService.reduceUser(userData.email)
        const tokens = await this.tokenService.generateTokens(reduceUser)
        await this.tokenService.saveRefreshToken(userData.id,  tokens.refreshToken)

        return tokens.refreshToken
    }


    


    // async registration(userDto: CreateUserDto) {


    //     const candidate = await this.userService.getUserByEmail(userDto.email);
    //     if (candidate) {
    //         throw new HttpException('Пользователь с таким email существует', HttpStatus.BAD_REQUEST);
    //     }
    //     const hashPassword = await bcrypt.hash(userDto.password, 5);
    //     const user = await this.userService.createUser({...userDto, password: hashPassword})

    //     return this.generateToken(user)

    //     // return 'rerer'
    // }

    async checkToken(token: string) {
        const validateAccessToken = this.tokenService.validateAccessToken(token)
        return validateAccessToken
    }
  
}
