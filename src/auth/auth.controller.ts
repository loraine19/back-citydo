import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity } from './auth.entities/auth.entity';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, readonly usersService: UsersService) { }

  @Post('signin')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: SignInDto) {
    return this.authService.signIn(email, password);
  }

  @Post('signup')
  @ApiOkResponse({ type: AuthEntity })
  async signup(@Body() { email, password }: SignUpDto) {
    return this.authService.signUp(email, password);
  }
}