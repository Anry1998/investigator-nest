import { Body, Controller, Get, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { Request, Response } from 'express';
// import { ValidateAccessToken } from './dto/validateAccessToken';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
    // Делаем инъекцию сервиса
    constructor(private authService: AuthService,
                private tokenService: TokenService) {}

    @Post('/registration')
    @UsePipes(new ValidationPipe())
    async registration(@Body() userDto: CreateUserDto,
                 @Res({ passthrough: true }) response: Response) {

        const registration = await this.authService.registration(userDto)
        // const res = JSON.stringify(registration).toString()
        response.cookie('refreshToken', registration.refreshToken, {maxAge:30*24*60*60*1000, httpOnly: true })
        return registration
    }

    @Post('/login')
    async login(@Body() userDto: CreateUserDto,
        @Res({ passthrough: true }) response: Response) {

        const login = await this.authService.login(userDto)
        response.cookie('refreshToken', login.refreshToken, {maxAge:30*24*60*60*1000, httpOnly: true })
        return login
    }

    @Get('/refresh')
    refresh(@Req() request: Request, 
            @Res({ passthrough: true }) response: Response) {
             
        const refresh = this.authService.refresh(request.cookies['refreshToken'])
        response.cookie('refreshToken', refresh, {maxAge:30*24*60*60*1000, httpOnly: true })
        return refresh
    }   
}
