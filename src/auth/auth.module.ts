import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AppService } from 'src/app/app.service';
import { JwtStrategy, APP_SECRET_KEY, JWT_TIMEOUT } from '@dohome/api-common';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: APP_SECRET_KEY,
      signOptions: { expiresIn: JWT_TIMEOUT },
    }),
    UsersModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, AppService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
