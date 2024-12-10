import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export class CreateGroupDto {

    @ApiProperty()
    address_id:number
    @ApiProperty()
    area: number;
    @ApiProperty()
    rules: string;
    @ApiProperty()
    name: string;
}
