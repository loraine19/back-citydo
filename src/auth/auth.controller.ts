import { Body, Controller, Delete, Get, HttpException, Ip, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthEntity, RefreshEntity } from './auth.entities/auth.entity';
import { UsersService } from '../../src/users/users.service';
import { SignInDto, SignInVerifyDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';
import { AuthGuard, AuthGuardGoogle, AuthGuardRefresh } from '../auth/auth.guard';
import { DeviceId, DeviceInfo, GetRefreshToken, User } from 'middleware/decorators';
import { DeleteAccountDto } from './dto/deleteAccount.dto';
import { $Enums, User as UserObj } from '@prisma/client';
import { RefreshDto } from './dto/refresh.dto';

declare module 'express' {
  export interface Request {
    user?: any;
  }
}

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, readonly usersService: UsersService) { }

  @Post('signinVerify')
  @ApiOkResponse({ type: AuthEntity })
  async signinVerify(
    @Body() data: SignInVerifyDto,
    @Ip() ip: string,
    @DeviceId() deviceInfo: DeviceInfo,
    @Res({ passthrough: true }) res: Response): Promise<{ user: Partial<UserObj> } | { message: string }> {
    return this.authService.signInVerify(data, res, deviceInfo, ip);
  }

  @Post('signin')
  @ApiOkResponse({ type: AuthEntity })
  async signin(
    @Body() data: SignInDto,

    @DeviceId() deviceInfo: DeviceInfo,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response): Promise<{ user: Partial<UserObj> } | { message: string }> {
    return this.authService.signIn(data, res, deviceInfo, ip);
  }

  @Post('signup')
  @ApiOkResponse({ type: AuthEntity })
  async signup(
    @Body() data: SignUpDto,

    @DeviceId() deviceInfo: DeviceInfo,
    @Ip() ip: string)
    : Promise<AuthEntity | { message: string }> {
    return this.authService.signUp(data, deviceInfo, ip);
  }

  //  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  async logout(
    @User() userId: number,

    @DeviceId() deviceInfo: DeviceInfo,
    @Res({ passthrough: true }) res: Response): Promise<{ message: string }> {
    return this.authService.logOut(userId, deviceInfo, res);
  }


  @UseGuards(AuthGuardRefresh)
  @ApiBearerAuth()
  @Post('refresh')
  @ApiOkResponse({ type: RefreshEntity })
  async refresh(
    @GetRefreshToken() data:any,
    @Ip() ip: string,
    @DeviceId() deviceInfo: DeviceInfo,
    @User() userId: number,
    @Res({ passthrough: true }) res: Response): Promise<{ message: string }> {
    try {
      const { refreshToken, } = data
      return this.authService.refresh(refreshToken, userId, deviceInfo, ip, res);
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

    @DeviceId() deviceInfo: DeviceInfo,
    @User() userId: number): Promise<{ message: string }> {
    return this.authService.deletAccount(userId, deviceInfo);
  }


  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('deleteAccountConfirm')
  @ApiOkResponse()
  async deleteAccountConfirm(
    @Body() data: DeleteAccountDto,
    @DeviceId() deviceInfo: DeviceInfo,
    @User() userId: number): Promise<{ message: string }> {
    const { email, deleteToken } = data;
    return this.authService.deletAccountConfirm(userId, email, deleteToken, deviceInfo);
  }

  @Delete('tester')
  async deleteTester() {
    return await this.authService.deleteTester()
  }


  // --- ROUTES POUR GOOGLE OIDC ---

  @Get('google')
  @UseGuards(AuthGuardGoogle) // Cette garde utilise votre GoogleAuthStrategy
  async googleAuth(@Req() req: Request) {
    console.log('Google Auth called')
  }

  @Get('google/redirect')
  @UseGuards(AuthGuardGoogle) // La stratégie traite le callback de Google et appelle `validate`
  async googleAuthRedirect(
    @Req() req: Request,
    @Res() res: Response,
    @DeviceId() deviceInfo: DeviceInfo,
    @Ip() ip: string) {
    const appUser = req.user as UserObj
    console.log('Google Auth Redirect called', appUser)

    if (!appUser) {
      const frontendErrorUrl = `${process.env.FRONT_URL}/signin?msg=Google%20Login%20Failed`;
      return res.redirect(frontendErrorUrl);
    }

    try {
      // Étape 1: Générer les JWT de VOTRE application pour cet utilisateur.
      const { accessToken, refreshToken } = await this.authService.login(appUser, deviceInfo, ip);

      this.authService.setAuthCookies(res, accessToken, refreshToken)

      res.redirect(process.env.FRONT_URL)

    } catch (error) {
      console.error('Erreur lors de la création de la session:', error);
      this.authService.setAuthCookiesLoggout(res);
      const frontendErrorUrl = `${process.env.FRONT_URL}/signin?msg=Google%20Session%20Creation%20Error`;
      res.redirect(frontendErrorUrl);
    }
  }


}
