import { ApiProperty } from '@nestjs/swagger';

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

export class UserEntity implements User {

  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  lastConnection: Date

  @ApiProperty()
  email: string;

    @ApiProperty()
        
    password: string;
    


}






// CREATE TABLE `User` (
//     `id` INTEGER NOT NULL  AUTO_INCREMENT,
//     `email` TEXT NOT NULL,
//     `password` TEXT NOT NULL,
//     `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     `lastConnection` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     PRIMARY KEY (`id`)
// );