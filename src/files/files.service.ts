import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path'
import * as fs from 'fs'
import * as uuid from 'uuid'



@Injectable()
export class FilesService {

    async createFile(file): Promise<string> {
        try {
            // генерируем уникальное название, если бы мы не знали четкое расширение файла, мы бы получалм его из названия исходного файла
            const fileName = uuid.v4() + '.jpg'
            // получаем путь к текущему файлу, получаем текущую папку  с помощью __dirname, возвращаемся на одну ('..'), выбираем папку статик
            const filePath = path.resolve(__dirname, '..', 'static')
            // Делаем проверку, если по этому пути ничего не существует, тогда создаем папку
            if (!fs.existsSync(filePath)) {
                //filePath - первый параметр - путь; второй - recursive: true - если какой-то папки небудет, njde  ее создаст
                fs.mkdirSync(filePath, {recursive: true})
            }
            // После того, как убедились, что папка существует, записываем туда файл, вызываем функцию join и склеиваем путь с название файла
            fs.writeFileSync(path.join(filePath, fileName), file.buffer)
            return fileName
        } catch (e) {
            throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
