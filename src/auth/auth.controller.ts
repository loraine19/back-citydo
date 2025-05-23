import { Body, Controller, Delete, Get, HttpException, Ip, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
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

// Extend the Request interface to include the user property
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

  //  @UseGuards(AuthGuard)
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


  // --- ROUTES POUR GOOGLE OIDC ---

  @Get('google')
  @UseGuards(AuthGuardGoogle) // Cette garde utilise votre GoogleAuthStrategy
  async googleAuth(@Req() req: Request) {
    console.log('Google Auth called')
  }

  @Get('google/redirect')
  @UseGuards(AuthGuardGoogle) // La stratégie traite le callback de Google et appelle `validate`
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response, @Ip() ip: string) {
    const appUser = req.user as UserObj
    console.log('Google Auth Redirect called', appUser)

    if (!appUser) {
      const frontendErrorUrl = `${process.env.FRONT_URL}/signin?msg=Google%20Login%20Failed`;
      return res.redirect(frontendErrorUrl);
    }

    try {
      // Étape 1: Générer les JWT de VOTRE application pour cet utilisateur.
      const { accessToken, refreshToken } = await this.authService.login(appUser);
      this.authService.setAuthCookies(res, accessToken, refreshToken)

      res.redirect(process.env.FRONT_URL)

    } catch (error) {
      console.error('Erreur lors de la création de la session:', error);
      const frontendErrorUrl = `${process.env.FRONT_URL}/signin?msg=Google%20Session%20Creation%20Error`;
      res.redirect(frontendErrorUrl);
    }
  }


}
