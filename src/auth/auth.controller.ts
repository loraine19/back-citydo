import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthEntity } from './auth.entities/auth.entity';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, readonly usersService: UsersService) { }

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Post('signup')
  @ApiOkResponse({ type: AuthEntity })
  async signup(@Body() { email, password }: LoginDto) {
    return this.authService.signup(email, password);
  }
}