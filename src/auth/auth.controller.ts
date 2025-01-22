import { Body, Controller, HttpException, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity, RefreshEntity, RequestWithUser } from './auth.entities/auth.entity';
import { UsersService } from '../../src/users/users.service';
import { SignInDto, SignInVerifyDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, readonly usersService: UsersService) { }


  @Post('signin/verify')
  @ApiOkResponse({ type: AuthEntity })
  async signinVerify(@Body() data: SignInVerifyDto): Promise<AuthEntity> {
    return this.authService.signInVerify(data);
  }
  @Post('signin')
  @ApiOkResponse({ type: AuthEntity })
  async signin(@Body() data: SignInDto): Promise<AuthEntity | { message: string }> {
    return this.authService.signIn(data);
  }



  @Post('signup')
  @ApiOkResponse({ type: AuthEntity })
  async signup(@Body() data: SignUpDto): Promise<AuthEntity | { message: string }> {
    return this.authService.signUp(data);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('refresh')
  @ApiOkResponse({ type: RefreshEntity })
  async refresh(@Body() { refreshToken }: RefreshDto, @Req() req: RequestWithUser,): Promise<AuthEntity | { message: string }> {

    try {
      const id = req.user.sub
      return this.authService.refresh(refreshToken, id);
    }
    catch (error) {
      console.log('catch error', error)
      throw new HttpException(error.message, 401);
    }
  }


}
