import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AppService } from 'src/app/app.service';
import { JwtStrategy } from './jwt.strategy';
import { JWT } from '@nikom.san/api-authen';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: JWT.SECRET_KEY,
      signOptions: { expiresIn: JWT.TIMEOUT },
    }),
    UsersModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, AppService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
