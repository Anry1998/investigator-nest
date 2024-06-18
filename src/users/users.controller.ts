import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './users.model';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
// import {  } from 'src/pipes/validation.pipe';


@ApiTags('Пользователи')

// В контроллер передаем параметром строку - по какому андпоинту будет отрабатывать запрос, не огбязательно ставить /users
@Controller('users')
export class UsersController {

    // Чтобы сервис использовать внутри контроллера, его надо внедрить в контролле при помощи constructor
    constructor(private usersService: UsersService) {}

    // Чтобы запрос работал, его надо пометить декоратором, чтобы контроллер заработал его надо зарегистрировать в module
    // @Get()
    // getUser() {
    //     return [{id: 1, name: 'Anry'}]
    // }

    @ApiOperation({summary: 'Создание пользователя'})
    @ApiResponse({status: 200, type: User})
    // @UsePipes(ValidationPipe)
    @Post()
    create(@Body() userDto: CreateUserDto) {
        return this.usersService.createUser(userDto)
    }

    @ApiOperation({summary: 'Получение всех пользователей'})
    @ApiResponse({status: 200, type: [User]})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.usersService.getAllUsers()
    }


    @ApiOperation({summary: 'Выдать роль'})
    @ApiResponse({status: 200})
    // @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post('/role')
    addRole(@Body() dto: AddRoleDto) {
        return this.usersService.addRole(dto)
    }

    @ApiOperation({summary: 'Забанить пользователя'})
    @ApiResponse({status: 200})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post('/ban')
    ban(@Body() dto: BanUserDto) {
        return this.usersService.ban(dto)
    }


    @ApiOperation({summary: 'Удалить пользователя'})
    @ApiResponse({status: 200, type: User})
    @Delete(':id')
    // Если будет строка не формата UUID, выдаст ошибку
    deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.deleteUser(id)
    }



}
