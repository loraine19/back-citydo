import { ApiProperty } from "@nestjs/swagger";
import { Like } from "@prisma/client";
import { IsNotEmpty, IsNumber, IsDate } from "class-validator";

export class LikeEntity implements Like {
    @ApiProperty()
    @IsDate()
    createdAt: Date;

    @ApiProperty()
    @IsDate()
    updatedAt: Date;

    //FOR DTO
    @ApiProperty()
    @IsNotEmpty({ message: 'user id is required' })
    @IsNumber()
    userId: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'post id is required' })
    @IsNumber()
    postId: number;

}

