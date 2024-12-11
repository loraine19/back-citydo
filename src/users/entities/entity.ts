import { ApiProperty, PartialType } from '@nestjs/swagger';
import { isEmail, IsEmail } from 'class-validator';
import { User } from '../../class'

export class Entity extends PartialType(User) {


    @ApiProperty
    ({
        format: 'email',
    })
    email: string;

    @ApiProperty()
    password: string;

}

