import { Controller, Request, Post, UseGuards, Get, Headers, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { KeysHeader } from 'src/app/app.constants';
import {
  JwtConstant,
  routeApiAuth,
  RAuthLogin,
  RAuthLogout,
  BAuthJwtValidate,
  RAuthJwtValidate,
  RAuthKillUser,
  RAuthPayload,
  RAuthUserRoles,
} from '@libs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post(routeApiAuth.login)
  async login(@Request() req): Promise<RAuthLogin> {
    return await this.authService.loginLocal(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(routeApiAuth.loginToken)
  loginToken(@Request() req) {
    return this.authService.loginToken(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post(routeApiAuth.logout)
  async logout(@Request() req): Promise<RAuthLogout> {
    return await this.authService.logout(req.user);
  }

  // เรียกใช้งานที่ jwt.strategy (ของ project อื่น)
  @Post(routeApiAuth.jwtValidate)
  async jwtValidate(
    @Headers(KeysHeader.ApiValidateKey) jwtValidateKey,
    @Body() body: BAuthJwtValidate,
  ): Promise<RAuthJwtValidate> {
    if (jwtValidateKey !== JwtConstant.VALIDATE_KEY) {
      throw new UnauthorizedException('Invalid key');
    }
    return await this.authService.jwtValidate(body.token);
  }

  @UseGuards(JwtAuthGuard)
  @Post(routeApiAuth.killUser)
  async killUser(@Request() req, @Body('userId') userKill: string): Promise<RAuthKillUser> {
    const { userId: userAdmin } = req.user;
    return await this.authService.killUser(userAdmin, userKill);
  }

  @UseGuards(JwtAuthGuard)
  @Get(routeApiAuth.payload)
  getPayload(@Request() req): RAuthPayload {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get(routeApiAuth.userRoles)
  async userRole(@Headers(KeysHeader.ApiModuleId) moduleId, @Request() req): Promise<RAuthUserRoles> {
    return await this.authService.getUserRoles(moduleId, req.user);
  }
}
