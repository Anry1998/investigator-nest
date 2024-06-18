import {NestFactory} from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
// import * as cors from 'cors'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { ValidationPipe } from '@nestjs/common'

async function start() {
    const PORT = process.env.PORT || 5000
    // создаем экземпляо приложения, вызываем функцию create и помещаем туда модуль
    const app = await NestFactory.create(AppModule)
    app.use(cookieParser());
    app.enableCors( {
        credentials: true,
        origin: 'http://localhost:3000'
    })


    // Для документа позволяет задавать каки-ето параметры это из swagger
    const config = new DocumentBuilder()
        // Зададим название приложения
        .setTitle('Проект nestjs')
        .setDescription('Документация  REST API')
        .setVersion('1.0.0')
        .addTag('V1.0.0')
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)
    // app.useGlobalGuards(JwtAuthGuard)
    // Pipes можно использовать глобально
    //  app.useGlobalPipes(new ValidationPipe())
    // через запятую передаем все пайпы и она будут отрабатывать для каждого андпоитнта

    // функция listen - как и в обычнои express
    await app.listen(PORT, () => console.log(`Сервер стартовал на порту ${PORT}`))
}

start()

