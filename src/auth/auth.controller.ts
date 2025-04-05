import { Body, Controller, Delete, Get, HttpException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity, RefreshEntity } from './auth.entities/auth.entity';
import { UsersService } from '../../src/users/users.service';
import { SignInDto, SignInVerifyDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';
import { AuthGuard, AuthGuardGoogle, AuthGuardRefresh } from '../auth/auth.guard';
import { GetRefreshToken, User } from 'middleware/decorators';
import { DeleteAccountDto } from './dto/deleteAccount.dto';
import { $Enums, User as UserObj } from '@prisma/client';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, readonly usersService: UsersService) { }


  @Post('signinVerify')
  @ApiOkResponse({ type: AuthEntity })
  async signinVerify(
    @Body() data: SignInVerifyDto,
    @Res({ passthrough: true }) res: Response): Promise<{ user: Partial<UserObj> } | { message: string }> {
    return this.authService.signInVerify(data, res);
  }


  @Post('signin')
  @ApiOkResponse({ type: AuthEntity })
  async signin(
    @Body() data: SignInDto,
    @Res({ passthrough: true }) res: Response): Promise<{ user: Partial<UserObj> } | { message: string }> {
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
    @Res({ passthrough: true }) res: Response): Promise<{ message: string }> {
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
    @Body() data: DeleteAccountDto,
    @User() userId: number): Promise<{ message: string }> {
    const { email, deleteToken } = data;
    return this.authService.deletAccountConfirm(userId, email, deleteToken);
  }

  @Delete('tester')
  async deleteTester() {
    return await this.authService.deleteTester()
  }


  @UseGuards(AuthGuardGoogle)
  @Get('google')
  async googleSignUp() {
    return await this.authService.googleSignUp()
  }

  @UseGuards(AuthGuardGoogle)
  @Get('google/redirect')
  async googleSignIn(@Req() req: Request, @Res() res: Response) {
    //  const { user } = req;

    return await this.authService.googleSignIn()
  }

}
