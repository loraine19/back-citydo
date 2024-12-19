import { Body, ConflictException, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity, RefreshEntity, RequestWithUser } from './auth.entities/auth.entity';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuthGuard } from './auth.guard';

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


  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('refresh')
  @ApiOkResponse({ type: RefreshEntity })
  async refresh(@Body() { refreshToken }: RefreshDto, @Req() req: RequestWithUser,) {
    console.log(refreshToken)
    console.log(req.user)
    const id = req.user.sub
    return this.authService.refresh(refreshToken, id);
  }
}