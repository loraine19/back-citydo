import { Controller, Post, Body, } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';

import { CreateResetPasswordDto } from './dto/create-reset-password.dto';

@Controller('reset-password')

export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService,) { }


  @Post()
  async requestResetPassword(@Body('email') email: string): Promise<{ message: string }> {
    return this.resetPasswordService.requestResetPassword(email);
  }


  @Post('update')
  async updatePassword(@Body() data: CreateResetPasswordDto): Promise<{ message: string }> {
    return this.resetPasswordService.updatePassword(data);
  }
}

