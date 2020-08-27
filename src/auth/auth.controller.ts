import { Controller, Request, Post, UseGuards, Get, Headers, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { KeysHeader } from 'src/app/app.constants';
import {
  JwtConstant,
  routeAuth,
  AuthLogin,
  AuthLogout,
  AuthKillUser,
  AuthJwtValidate,
  AuthJwtValidateBody,
  AuthPayload,
  AuthUserRoles,
} from '@libs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post(routeAuth.login)
  async login(@Request() req): Promise<AuthLogin> {
    return await this.authService.loginSuccessed(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(routeAuth.logout)
  async logout(@Request() req): Promise<AuthLogout> {
    return await this.authService.logout(req.user);
  }

  // เรียกใช้งานที่ jwt.strategy (ของ project อื่น)
  @Post(routeAuth.jwtValidate)
  async jwtValidate(
    @Headers(KeysHeader.ApiValidateKey) jwtValidateKey,
    @Body() body: AuthJwtValidateBody,
  ): Promise<AuthJwtValidate> {
    if (jwtValidateKey !== JwtConstant.VALIDATE_KEY) {
      throw new UnauthorizedException('Invalid key');
    }
    return await this.authService.jwtValidate(body.token);
  }

  @UseGuards(JwtAuthGuard)
  @Post(routeAuth.killUser)
  async killUser(@Request() req, @Body('userId') userKill: string): Promise<AuthKillUser> {
    const { userId: userAdmin } = req.user;
    return await this.authService.killUser(userAdmin, userKill);
  }

  @UseGuards(JwtAuthGuard)
  @Get(routeAuth.payload)
  getPayload(@Request() req): AuthPayload {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get(routeAuth.userRoles)
  async userRole(@Headers(KeysHeader.ApiModuleId) moduleId, @Request() req): Promise<AuthUserRoles> {
    return await this.authService.getUserRoles(moduleId, req.user);
  }
}
