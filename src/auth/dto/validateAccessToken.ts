import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length} from "class-validator";

// dto - это простой объект, который не содержив в себе никакой логики и имеет только поля, они предназначены для обмена данными между подсистемами

export class ValidateAccessToken {

    // @ApiProperty({example: 'user@email.ru', description: 'Почтовый адрес'})
    // @IsString({message: 'Должно быть строкой'})
    readonly token: string
    
}