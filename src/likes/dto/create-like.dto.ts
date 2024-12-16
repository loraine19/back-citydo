import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateLikeDto {
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
