import {Module} from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { User } from './users/users.model';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.model';

import { UserRoles } from './roles/user-roles.model';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/posts.model';
import { FilesModule } from './files/files.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import * as path from 'path';
import { Token } from './auth/token.model';

// Добавляем декоратор @Module
// Декоратор - это обертка, которая добавляет классу или функции новый функционал

@Module({
    controllers: [],
    providers: [],
    //  imports - все, что мы берем из вне в этот модуль
    imports: [
      // npm i -g @nestjs/cinfig - установка глобальных переменнных, затем, чтобы nest все считывал, добавляем ConfigModule, .env не выгружается на githab
        ConfigModule.forRoot({
          // Указываем путь до файла конфигурации, создаем в корне проекта .env 
          // в начеое видео, до некоторых махинация было так: envFilePath: '.env'

          // файлы для продакшен и для девелопмент версий отличаются, поэтому создаем в корне файл - .development.env
          // Следом устанавливаем пакет npm i cross-env и делаем махинации в package.json, смотри туда
          // "start": "nest start" меняем на "start": "cross-env NODE_ENV=production nest start",
          // "start:dev": "nest start --watch" меняем на "start:dev": "cross-env NODE_ENV=development nest start --watch",
          // и только после этого делаем суету внизу: envFilePath: `.${process.env.NODE_ENV}.env`, не забудь поставить . в начале
          
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        ServeStaticModule.forRoot({
          rootPath: path.resolve( __dirname, 'static'),
      }),
      // Подключение к БД, перед этим устанавливаем Sequelize - npm install --save-dev @types/sequelize
        SequelizeModule.forRoot({
          dialect: 'mysql',
          host: process.env.MYSQL_HOST,
          // Переводим в числовое значение
          port: Number(process.env.MYSQL_PORT),
          username: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DB,
          // регистрируем все модели
          models: [User, Role, UserRoles, Post, Token],
          // Чтобы Sequelize создавал таблицы в БД на основе моих моделей
          autoLoadModels: true
        }),
        // npm i -g @nestjs/cli - суета, которая позволяет автоматически генерировать модули
        // для этого необходимо ввести команду nest generate module users
        // Модуль автоматически добавляется внизу
        UsersModule,
        RolesModule,
        AuthModule, 
        PostsModule,
        FilesModule
        
      ]
})
export class AppModule {}

