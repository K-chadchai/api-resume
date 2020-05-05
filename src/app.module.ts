import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from 'nest-router';
import { routes } from './app.routes';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploaderModule } from './uploader/uploader.module';
import { MediaModule } from './media/media.module';
import { CategoryModule } from './category/category.module';
import { UsersModule } from './users/users.module';
import { CategoryFolderModule } from './category-folder/category-folder.module';
import { ImagePositionModule } from './image-position/image-position.module';
import { MediaImagesModule } from './media-images/media-images.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: '.env.development' }),
    RouterModule.forRoutes(routes),
    UploaderModule,
    MediaModule,
    CategoryModule,
    CategoryFolderModule,
    UsersModule,
    ImagePositionModule,
    MediaImagesModule,
  ],
})
export class AppModule {}
