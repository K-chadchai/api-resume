import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from 'nest-router';
import { routes } from './app.routes';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediasModule } from '../modules/medias/medias.module';
import { UsersModule } from '../modules/users/users.module';
import { ImagePositionModule } from '../modules/image-position/image-position.module';
import { CategoriesModule } from '../modules/categories/categories.module';
import { FoldersModule } from '../modules/folders/folders.module';
import { ImagesModule } from '../modules/images/images.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: '.env.development' }),
    RouterModule.forRoutes(routes),
    CategoriesModule,
    FoldersModule,
    ImagePositionModule,
    ImagesModule,
    MediasModule,
    UsersModule,
  ],
})
export class AppModule {}
