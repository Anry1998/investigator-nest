import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './roles.model';
import { UserRoles } from './user-roles.model';
import { where } from 'sequelize';

@Injectable()
export class RolesService {
    constructor(@InjectModel(Role) private roleRepository: typeof Role,
                @InjectModel(UserRoles) private userRoleRepository: typeof UserRoles) {}

    async createRole(dto: CreateRoleDto) {
        const role = await this.roleRepository.create(dto)
        return role
    }
    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne({where: {value}})
        return role
    }

    async getUsersRoles(userId: number) {
        const role = await this.userRoleRepository.findAll({
            where: {userId: userId}
        })
        return role
    }
}
