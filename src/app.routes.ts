import { Routes } from 'nest-router';
import { MediaModule } from './media/media.module';
import { CategoryModule } from './category/category.module';
import { UsersModule } from './users/users.module';
import { CategoryFolderModule } from './category-folder/category-folder.module';
import { ImagePositionModule } from './image-position/image-position.module';
import { MediaImagesModule } from './media-images/media-images.module';

export const routes: Routes = [
  {
    path: '/v1',
    children: [
      MediaModule,
      CategoryModule,
      UsersModule,
      CategoryFolderModule,
      ImagePositionModule,
      MediaImagesModule,
    ],
  },
];
