import { Routes } from 'nest-router';
import { MediasModule } from '../modules/medias/medias.module';
import { UsersModule } from '../modules/users/users.module';
import { FoldersModule } from '../modules/folders/folders.module';
import { ImagePositionModule } from '../modules/image-position/image-position.module';
import { ImagesModule } from '../modules/images/images.module';
import { CategoriesModule } from '../modules/categories/categories.module';
import { MediaSideModule } from 'src/modules/media-side/media-side.module';
import { MediaFolderModule } from 'src/modules/media-folder/media-folder.module';

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
      MediaSideModule,
      MediaFolderModule
    ],
  },
];
