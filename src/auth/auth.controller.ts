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


  @Post('signinVerify')
  @ApiOkResponse({ type: AuthEntity })
  async signinVerify(
    @Body() data: SignInVerifyDto,
    @Res({ passthrough: true }) res: Response): Promise<{ refreshToken: string } | { message: string }> {
    console.log(data)
    return this.authService.signInVerify(data, res);
  }


  @Post('signin')
  @ApiOkResponse({ type: AuthEntity })
  async signin(
    @Body() data: SignInDto,
    @Res({ passthrough: true }) res: Response): Promise<{ refreshToken: string } | { message: string }> {
    return this.authService.signIn(data, res);
  }

  @Post('signup')
  @ApiOkResponse({ type: AuthEntity })
  async signup(
    @Body() data: SignUpDto): Promise<AuthEntity | { message: string }> {
    return this.authService.signUp(data);
  }


  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  async logout(
    @User() userId: number,
    @Res({ passthrough: true }) res: Response): Promise<{ message: string }> {
    return this.authService.logOut(userId, res);
  }


  @UseGuards(AuthGuardRefresh)
  @ApiBearerAuth()
  @Post('refresh')
  @ApiOkResponse({ type: RefreshEntity })
  async refresh(
    @GetRefreshToken() data: any,
    @Res({ passthrough: true }) res: Response): Promise<{ refreshToken: string } | { message: string }> {
    try {
      const { refreshToken, userId } = data
      return this.authService.refresh(refreshToken, userId, res);
    }
    catch (error) {
      throw new HttpException(error.message, 401);
    }
  }


  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('deleteAccount')
  @ApiOkResponse()
  async deleteAccount(
    @User() userId: number): Promise<{ message: string }> {
    return this.authService.deletAccount(userId);
  }


  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('deleteAccountConfirm')
  @ApiOkResponse()
  async deleteAccountConfirm(
    @Body() { email, token }: { email: string, token: string },
    @User() userId: number): Promise<{ message: string }> {
    return this.authService.deletAccountConfirm(userId, email, token);
  }


}
