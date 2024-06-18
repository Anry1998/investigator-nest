import { ApiProperty } from "@nestjs/swagger";

export class CreateRoleDto {

    @ApiProperty({example: 'ADMIN', description: 'Название роли'})
    readonly value: string
    @ApiProperty({example: 'Aa12345', description: 'ПОписание роли'})
    readonly description: string
}