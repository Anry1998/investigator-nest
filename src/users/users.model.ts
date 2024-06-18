import { ApiProperty } from "@nestjs/swagger";
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Token } from "src/auth/token.model";

import { Post } from "src/posts/posts.model";
import { Role } from "src/roles/roles.model";
import { UserRoles } from "src/roles/user-roles.model";

// в interface (второй дженерик) описываем лишь то, что ожидаем на входе
// Не смотря на то, что user у нас имеет 6 полей, он в инпут будет вводить только логин и пароль
// все остальное будет имет defaultValue или autoIncrement
// !!!!!!!!!! Не забудь зарегистрировать модель в app.module.ts а также в users.module.ts
interface UserCreationAttrs {
    email: string;
    password: string
}


// Декоратор таблицы
@Table({tableName: 'users', paranoid: true})
// создание схем БД, клас User наследуется от класса Model в sequelize-typescript
// У класса два дженерика
export class User extends Model<User, UserCreationAttrs> {
    @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
    // Декоратор колонки
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ApiProperty({example: 'user@email.ru', description: 'Почтовый адрес'})
    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @ApiProperty({example: 'Aa12345', description: 'Пароль пользователя'})
    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @ApiProperty({example: 'true', description: 'Забанен пользователь или нет'})
    @Column({type: DataType.BOOLEAN, defaultValue: false})
    banned: boolean;

    @ApiProperty({example: 'За хулиганство', description: 'Причина блокировки'})
    @Column({type: DataType.STRING,  allowNull: true})
    banReason: string

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[]

    // @BelongsToMany(() => Token, () => UserTokens)
    // token: Token[]

    @HasMany(() => Token)
    token: Token[]

    @HasMany(() => Post)
    posts: Post[] 


}