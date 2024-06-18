import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { Role } from 'src/roles/roles.model';
import { UserRoles } from 'src/roles/user-roles.model';
import { RolesModule } from 'src/roles/roles.module';
import { AuthModule } from 'src/auth/auth.module';
import { Post } from 'src/posts/posts.model';


@Module({
  // Тут мы зарегистрировали контроллер
  controllers: [UsersController],
  // Провайдер - любой переиспользуемый компонент (сервисы с логикой ,имплементации патернов, стратегий)
  providers: [UsersService],
  imports: [
    forwardRef(() => AuthModule),
    // Регистрируем модель
    SequelizeModule.forFeature([User, Role, UserRoles, Post]),
    RolesModule
    
  ],
  exports: [
    UsersService,
    SequelizeModule.forFeature([User]),
  ]
})
export class UsersModule {}
