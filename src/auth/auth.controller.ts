import { Controller, Request, Post, UseGuards, Get, Headers, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JWT_VALIDATE_KEY } from '@nikom.san/api-common';
import { KeysHeader } from 'src/app/app.constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.loginSuccessed(req.user);
  }

  @Post('jwt-validate')
  async jwtValidate(@Headers(KeysHeader.ApiValidateKey) jwtValidateKey, @Body('token') tokenPayload) {
    if (jwtValidateKey !== JWT_VALIDATE_KEY) {
      throw new UnauthorizedException('Invalidate jwt-validate-key');
    }
    return await this.authService.jwtValidate(tokenPayload);
  }

  @UseGuards(JwtAuthGuard)
  @Post('killer')
  async killLoginActive(@Request() req) {
    const { userId, uuid } = req.user;
    return await this.authService.killLoginActive(userId, uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-roles')
  async userRole(@Headers(KeysHeader.ApiModuleId) moduleId, @Request() req) {
    return await this.authService.getUserRoles(moduleId, req.user);
  }
}
