import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length} from "class-validator";

// dto - это простой объект, который не содержив в себе никакой логики и имеет только поля, они предназначены для обмена данными между подсистемами

export class CreateUserDto {

    @ApiProperty({example: 'user@email.ru', description: 'Почтовый адрес'})
    @IsString({message: 'Должно быть строкой'})
    @IsEmail({}, {message: 'Некоректный email'})
    readonly email: string
    @ApiProperty({example: 'Aa12345', description: 'Пароль пользователя'})
    @IsString({message: 'Должно быть строкой'})
    @Length(4, 16, {message: 'Не меньше 4 и не больше 6'})
    readonly password: string

    
    // a1eb4992-693f-4e3d-ad3e-88fdf9a4861b
    readonly activationLink: string
}