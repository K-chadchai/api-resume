import { Controller, Request, Post, UseGuards, Get, Body, Headers } from '@nestjs/common';
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
  @Get('userrole')
  async userRole(@Request() req, @Headers() headers) {
    const apiProgram = headers['api-program'];
    return await this.authService.userRole(req.user, apiProgram);
  }
}
