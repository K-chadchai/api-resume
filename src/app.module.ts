import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from 'nest-router';
import { routes } from './app.routes';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediasModule } from './medias/medias.module';
import { UsersModule } from './users/users.module';
import { ImagePositionModule } from './image-position/image-position.module';
import { CategoriesModule } from './categories/categories.module';
import { FoldersModule } from './folders/folders.module';
import { ImagesModule } from './images/images.module';

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
