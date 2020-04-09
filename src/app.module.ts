import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { routes } from './app/app.routes';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [RouterModule.forRoutes(routes), AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
