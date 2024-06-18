import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'
import { User } from 'src/users/users.model';

import { JwtModule } from '@nestjs/jwt';
import { Token } from './token.model';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

@Injectable()
export class TokenService {

    constructor(private jwtService: JwtService,
                 @InjectModel(Token) private tokenRepository: typeof Token) {}

    async generateTokens(user: any) {
        // const payload = {email: user.email, id: user.id}
        const accessToken = await this.jwtService.signAsync({user}, {secret: process.env.JWT_ACCESS_SECRET, expiresIn: '1m'})
        const refreshToken = await this.jwtService.signAsync({user}, {secret: process.env.JWT_ACCESS_SECRET, expiresIn: '30d'})
        return {accessToken, refreshToken} 
    }

    async saveRefreshToken(userId, refreshToken) {
        const token = await this.tokenRepository.create({userId: userId, refreshToken})
        return token
    }

    async saveRefreshTokenAfterRegistration(userId, refreshToken) {
        // Ищем в БД пользователя с указанным id 
        // Так как в БД будет храниться до 5 refreshToken одного юзера, нам необходимо чтобы и id и refreshToken совпадали
        const tokenData = await this.tokenRepository.findOne({
            where: {[Op.and]: [{userId: userId}, {refreshToken: refreshToken}]}
        })
        // если пользователь существует перезаписываем рефреш токен и сохранеем refreshToken в БД токенов - save()
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        // Реализация функции которая ищет весь перечень токенов и если их больше пяти, удалеет первый
        const arrTokens = await this.tokenRepository.findAll({where: {userId: userId}})
        if (arrTokens.length = 5) {
            const firstArrTokensId = arrTokens[0].id
            const deleteFirstToken = await this.tokenRepository.destroy({where: {id: firstArrTokensId}})
        }

        // Если пользователь с указанным токеном не найден создаем в БД токенов новые данные пользователя, куда передаем id и  рефреш токен
        const token = await this.tokenRepository.create({userId: userId, refreshToken})
        return token
    }

    validateAccessToken(token: string) {
        try {
            const userData = this.jwtService.verify(token, {secret: process.env.JWT_ACCESS_SECRET})
            return userData
        } catch(e) {
            return null
        }
    }

    validateRefreshToken(token: string) {
        try {
            const userData = this.jwtService.verify(token, {secret: process.env.JWT_REFRESH_SECRET})
            return userData
        } catch(e) {
            return null
        }
    }

    async removeRefreshToken(refreshToken) {
        const deleteToken = await this.tokenRepository.destroy({where:{refreshToken: refreshToken}})
        return deleteToken 
    }

    async findRefreshToken(refreshToken) {
        const deleteToken = await this.tokenRepository.findOne({where:{refreshToken: refreshToken}})
        return deleteToken 
    }
}
