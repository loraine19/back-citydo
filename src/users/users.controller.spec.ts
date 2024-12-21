import { NotFoundException } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { PrismaService } from "../../src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { JwtModule } from "@nestjs/jwt";

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})], // Add this line
      controllers: [UsersController],
      providers: [UsersService, PrismaService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });


  it('should return all users', async () => {
    const users = await controller.findAll();
    expect(users).toBeInstanceOf(Array);
  });

  it('should return a user by id', async () => {
    const user = await controller.findOne(1);
    expect(user).toBeDefined();
    expect(user).toHaveProperty('id', 1);
  });





  it('should update a user', async () => {
    const updateUserDto: UpdateUserDto = {
      email: 'test2@mail.com',
      password: 'passwordtest2',
    };

    const user = await controller.update(1, updateUserDto);
    expect(user).toBeDefined();
    expect(user).toHaveProperty('email', updateUserDto.email);
    expect(user).toHaveProperty('password')
  });

  it('should throw an error if user not found', async () => {
    jest.spyOn(controller['usersService'], 'findOne').mockRejectedValueOnce(new NotFoundException());
    await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should delete a user', async () => {
    jest.spyOn(controller['usersService'], 'remove').mockResolvedValueOnce({} as any);
    await expect(controller.remove(1)).resolves.not.toThrow();
  })

});


