import { ApiProperty } from "@nestjs/swagger";
import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";

import { User } from "src/users/users.model";


interface CreateToken {
    userId: string;
    refreshToken: string
}


@Table({tableName: 'token'})
export class Token extends Model<Token , CreateToken> {

    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER})
    userId: number;

    // @ApiProperty({example: 'user@email.ru', description: 'Почтовый адрес'})
    @Column({type: DataType.STRING})
    refreshToken: string;

    @BelongsTo(() => User)
    autor: User 

} 