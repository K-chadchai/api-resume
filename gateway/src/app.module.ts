import { Module } from '@nestjs/common';
import { PictureModule } from './picture/picture.module';
import { RouterModule } from 'nest-router';
import { routes } from './app.routes';

@Module({
  imports: [RouterModule.forRoutes(routes), PictureModule],
})
export class AppModule {}
