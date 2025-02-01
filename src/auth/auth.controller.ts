import { Body, Controller, HttpException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity, RefreshEntity, RequestWithUser } from './auth.entities/auth.entity';
import { UsersService } from '../../src/users/users.service';
import { SignInDto, SignInVerifyDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';
import { RefreshDto } from './dto/refresh.dto';
import { AuthGuard, AuthGuardRefresh } from '../auth/auth.guard';
import { GetRefreshToken, User } from 'middleware/decorators';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, readonly usersService: UsersService) { }


  @Post('signin/verify')
  @ApiOkResponse({ type: AuthEntity })
  async signinVerify(
    @Body() data: SignInVerifyDto,
    @Res({ passthrough: true }) res: Response): Promise<AuthEntity> {
    return this.authService.signInVerify(data, res);
  }
  @Post('signin')
  @ApiOkResponse({ type: AuthEntity })
  async signin(
    @Body() data: SignInDto,
    @Res({ passthrough: true }) res: Response): Promise<AuthEntity | { message: string }> {
    return this.authService.signIn(data, res);
  }



  @Post('signup')
  @ApiOkResponse({ type: AuthEntity })
  async signup(
    @Body() data: SignUpDto): Promise<AuthEntity | { message: string }> {
    return this.authService.signUp(data);
  }

  @UseGuards(AuthGuardRefresh)
  @ApiBearerAuth()
  @Post('refresh')
  @ApiOkResponse({ type: RefreshEntity })
  async refresh(
    @GetRefreshToken() data: any,
    @Res({ passthrough: true }) res: Response): Promise<AuthEntity | { message: string }> {
    try {
      const { refreshToken, userId } = data
      return this.authService.refresh(refreshToken, userId, res);
    }
    catch (error) {
      console.log('catch error', error)
      throw new HttpException(error.message, 401);
    }
  }


}
