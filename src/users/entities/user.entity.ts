import { ApiProperty, PartialType } from '@nestjs/swagger';

export class User {
    id: number;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    lastConnection: Date;

    constructor(
        id: number,
        email: string,
        password: string,
        createdAt: Date,
        updatedAt: Date,
        lastConnection: Date
    ) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.lastConnection = lastConnection;
    }
}

export class UserEntity extends PartialType(User) {

    @ApiProperty()
    id: number;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

}

