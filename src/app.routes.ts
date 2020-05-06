import { Routes } from 'nest-router';
import { MediasModule } from './medias/medias.module';
import { UsersModule } from './users/users.module';
import { FoldersModule } from './folders/folders.module';
import { ImagePositionModule } from './image-position/image-position.module';
import { ImagesModule } from './images/images.module';
import { CategoriesModule } from './categories/categories.module';

export const routes: Routes = [
  {
    path: '/v1',
    children: [
      CategoriesModule,
      FoldersModule,
      ImagePositionModule,
      ImagesModule,
      MediasModule,
      UsersModule,
    ],
  },
];
