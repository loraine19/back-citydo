export class User {
    id: number;
    email: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    lastConnection: Date;

    constructor(
        id: number,
        email: string,
        password: string,
        created_at: Date,
        updated_at: Date,
        lastConnection: Date
    ) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.lastConnection = lastConnection;
    }
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