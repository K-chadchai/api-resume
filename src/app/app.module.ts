import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { routes } from './app.routes';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediasModule } from '../modules/medias/medias.module';
import { UsersModule } from '../modules/users/users.module';
import { ImagePositionModule } from '../modules/image-position/image-position.module';
import { CategoriesModule } from '../modules/categories/categories.module';
import { FoldersModule } from '../modules/folders/folders.module';
import { ImagesModule } from '../modules/images/images.module';
import { EasyconfigModule } from 'nestjs-easyconfig';
import { MediaSideModule } from 'src/modules/media-side/media-side.module';

@Module({
  imports: [
    EasyconfigModule.register({}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: 'postgres',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    RouterModule.forRoutes(routes),
    CategoriesModule,
    FoldersModule,
    ImagePositionModule,
    ImagesModule,
    MediasModule,
    UsersModule,
    MediaSideModule
  ],
})
export class AppModule { }
