import { Body, Controller, Delete, Get, Param, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { MailService } from './mail.service';
import { UsersService } from 'src/users/users.service';


@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
    // Делаем инъекцию сервисаs
    constructor(private authService: AuthService,
                private userService: UsersService,
                private mailService: MailService) {}

    @ApiOperation({summary: 'Регистрация пользователя, на'})
    @ApiResponse({status: 200})
    // @ApiCookieAuth('refreshToken')
    @Post('registration')
    @UsePipes(new ValidationPipe())
    async registration(@Body() userDto: CreateUserDto,
                 @Res({ passthrough: true }) response: Response) {

        const registration = await this.authService.registration(userDto)
        // const res = JSON.stringify(registration).toString()
        response.cookie('refreshToken', registration.refreshToken, {maxAge:30*24*60*60*1000, httpOnly: true })
        return registration
    }

    @ApiOperation({summary: 'Авторизация пользователя'})
    @ApiResponse({status: 200})
    @Post('login')
    async login(@Body() userDto: CreateUserDto,
        @Res({ passthrough: true }) response: Response) {

        const login = await this.authService.login(userDto)
        response.cookie('refreshToken', login.refreshToken, {maxAge:30*24*60*60*1000, httpOnly: true })
        return login
    }

    @ApiOperation({summary: 'Выход пользователя из аккаунта, в request приинимает cookies refreshToken'})
    @ApiResponse({status: 200})
    @Delete('logout') 
    async logout(@Req() request: Request,
                 @Res({ passthrough: true }) response: Response) {

        const refresh = request.cookies['refreshToken']
        const logout = await this.authService.logout(refresh)
        response.clearCookie('refreshToken')
         return request.cookies['refreshToken']
    }

    @Get('refresh')
    refresh(@Req() request: Request, 
            @Res({ passthrough: true }) response: Response) {
             
        const refresh = this.authService.refresh(request.cookies['refreshToken'])
        response.cookie('refreshToken', refresh, {maxAge:30*24*60*60*1000, httpOnly: true })
        return refresh 
    }   

    @Get('activate/:link')
    async activate(@Param('link') link: string) {
             
        const activate = await this.userService.activate(link)

        return link
    } 


    // @Post('/mail')
    //  mail(@Body() userMail: string, activationLink: string) {

    //      const send =  this.mailService.mailSendActivateLink(userMail, activationLink)

    //     return activationLink
    // }
}
