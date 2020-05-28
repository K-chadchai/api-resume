import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { routes } from './app.routes';
import { AuthModule } from '../auth/auth.module';
import { EasyconfigModule } from 'nestjs-easyconfig';

@Module({
  imports: [EasyconfigModule.register({}), RouterModule.forRoutes(routes), AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
