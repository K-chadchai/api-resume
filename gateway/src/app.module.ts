import { Module } from '@nestjs/common';
import { PictureModule } from './picture/picture.module';
import { RouterModule } from 'nest-router';
import { routes } from './app.routes';
import { UsersModule } from './users/users.module';

@Module({
  imports: [RouterModule.forRoutes(routes), PictureModule, UsersModule],
})
export class AppModule {}
