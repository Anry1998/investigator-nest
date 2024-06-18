import {ArgumentMetadata, Injectable, PipeTransform} from '@nestjs/common'
import {plainToClass} from 'class-transformer'
import { validate } from 'class-validator'
import { ValidationException } from 'src/exceptions/validation.exception'
// Pipe имеют два основных значения: 1 - как-то преобразовывать входные данные (например строку переводить в число)
// 2 - валидация входных данных
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        // Получаем объект, который мы бедм валидировать функция plainToClass будет преобразовывать значение в нужный для нас класс
        const obj = plainToClass(metadata.metatype, value)
        // функция validate возвращает ошибки, которые вернуться после валидации объекта
        const errors = await validate(obj)

        if (errors.length) {
            console.log(errors)
            let messages = errors.map(err => {
                // property  - название поля, которое не прошло валидацию
                // constraints - сообщения, которые указаны в dto
                return `${err.property} - ${Object.values(err.constraints).join(', ')}`
            })
            throw new ValidationException(messages)
        }
        return value
    }
}