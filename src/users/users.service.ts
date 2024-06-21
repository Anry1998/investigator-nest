import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './users.model';
import { Role } from '../roles/roles.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';
import { Op } from 'sequelize';

import * as bcrypt from 'bcrypt'

// Чтобы клас стал провайдером, необходимо пометить его @Injectable(), поскольку в дальнейшем сервис будет внедряться в контроллер
// Контроллер должен быть максимально простым, без логики, он лиш получает запрос и отдает ответ
// Вся логика содержится в сервисе (провайдере), не него ссылается контроллер
@Injectable()
export class UsersService {

    // Внедряем модель в клас, так как в этом сервисе мы будем обращаться в таблице Users
    // не забывай про декоратор @InjectModel

    //private - чтобы фактически не позволять никому (кроме самого класса) создавать экземпляр класса
    // инжектим таблицу User,  а также сервис,   указываем, что объект класса UsersService на входе будет принимать данные typeof User 
    constructor(@InjectModel(User) private userRepository: typeof User,
                @InjectModel(Role) private roleRepository: typeof Role,
                private roleService: RolesService) {}

    // указываем, что объект класса UsersService функции createUser на входе будет принимать данные typeof CreateUserDto
    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto)
        const role = await this.roleService.getRoleByValue('USER')

        // Метод $set позволяет перезаписать какое-то поле и сразу обновить его внутри базы данных
        // Поскольку изначально у пользователя ролей нет, указываем массив, в котором добавляем один единственный id из role
        await user.$set('roles', [role.id])
        user.roles = [role]
 
        

        return user
    }

    async reduceUser(userEmail: string) {
        const shortUser = await this.userRepository.findOne({
            where: {email: userEmail},
            attributes: ['id', 'email'],
            include: {
                model: Role,
                through: { attributes: [] },
                attributes: {exclude: [ 'id',  "description", "createdAt", "updatedAt", 'UserRoles']} 
            },
            
        })
        return shortUser
    }

    async getAllUsers() {
        // {include: {all: true} - добавляем в запрос все поля с которыми как-то связан пользовактель, однако можно указать и конкретную таблицу
        const users = await this.userRepository.findAll({include: {all: true}})
        return users
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email}, include: {all: true} })
        return user
    }

    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId)
        const role = await this.roleService.getRoleByValue(dto.value)
        if (user && role) {
            await user.$add('role', role.id)
            return dto
        }
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND)
    }

    async delateRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId)
        const role = await this.roleService.getRoleByValue(dto.value)
        if (user && role) {
            await user.$remove('role', role.id)
            return dto
        }
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND)
    }


    async activate(activationLink: string) {
        const user = await this.userRepository.findOne({where: {activationLink}})
        if (!user) {
            throw new HttpException(`Некорректная ссылка активации`, HttpStatus.BAD_REQUEST)
        }
        user.isActivated = true
        await user.save()
        return user
    }

    async ban(dto: BanUserDto) {
        const user = await this.userRepository.findByPk(dto.userId)
        if (!user) {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
        }
        user.banned = true
        user.banReason = dto.banReason
        await user.save()
        return user
    }

    async deleteUser(userId: string) {
        const deleteUser =  await this.userRepository.destroy({
            where: {id: userId},
        })
        return deleteUser 
    }

    async restoreUser(dto: CreateUserDto) {

        const restoreUser =  await this.userRepository.restore({
            where: {email: dto.email},
        })
        const user = await this.getUserByEmail(dto.email)
        if (!user) {
            throw new HttpException(`Пользователь с таким email: ${dto.email} не был найден`, HttpStatus.BAD_REQUEST)
        }
        const isPassEquals = await bcrypt.compare(dto.password, user.password)
        if (!isPassEquals) {
            await this.userRepository.destroy({where: {email: dto.email}})
            throw new HttpException(`Введен неверный пароль`, HttpStatus.BAD_REQUEST)
        }
        return restoreUser 
    }


}
