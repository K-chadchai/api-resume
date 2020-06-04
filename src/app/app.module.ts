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
import { MemberModule } from 'src/modules/member/member.module';
import { FoodModule } from 'src/modules/food/food.module';
import { InterstRateModule } from 'src/modules/interst-rate/interst-rate.module';

@Module({
  imports: [
    EasyconfigModule.register({}),
    TypeOrmModule.forRoot(),
    RouterModule.forRoutes(routes),
    CategoriesModule,
    FoldersModule,
    ImagePositionModule,
    ImagesModule,
    MediasModule,
    UsersModule,
    MemberModule,
    FoodModule,
    InterstRateModule
  ],
})
export class AppModule { }
