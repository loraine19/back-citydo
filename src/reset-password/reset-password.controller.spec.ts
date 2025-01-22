import { Test, TestingModule } from '@nestjs/testing';
import { ResetPasswordController } from './reset-password.controller';
import { ResetPasswordService } from './reset-password.service';
import { UsersService } from 'src/users/users.service';
import { PrismaClient } from '@prisma/client';
import { MailerService } from 'src/mailer/mailer.service';

describe('ResetPasswordController', () => {
  let controller: ResetPasswordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResetPasswordController],
      providers: [ResetPasswordService, UsersService, PrismaClient, MailerService],
    }).compile();

    controller = module.get<ResetPasswordController>(ResetPasswordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
