import { Controller, Request, Post, UseGuards, Get, Headers, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.loginSuccessed(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('jwt-validate')
  jwtValidate(@Request() req) {
    req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('killer')
  killLoginActive(@Request() req) {
    const { userId, uuid } = req.user;
    return this.authService.killLoginActive(userId, uuid);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('userroles')
  async userRole(@Headers('api-module-id') moduleId, @Request() req) {
    return await this.authService.getUserRoles(moduleId, req.user);
  }
}
