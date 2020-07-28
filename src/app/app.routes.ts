import { Routes } from 'nest-router';
import { MediasModule } from '../modules/medias/medias.module';
import { UsersModule } from '../modules/users/users.module';
import { FoldersModule } from '../modules/folders/folders.module';
import { ImagePositionModule } from '../modules/image-position/image-position.module';
import { ImagesModule } from '../modules/images/images.module';
import { CategoriesModule } from '../modules/categories/categories.module';
import { MediaSideModule } from 'src/modules/media-side/media-side.module';
import { MediaFolderModule } from 'src/modules/media-folder/media-folder.module';
import { MediaActivityLogModule } from 'src/modules/media-activity-log/media-activity-log.module';
import { MediaArticleModule } from 'src/modules/media-article/media-article.module';
import { MediaImageShareModule } from 'src/modules/media-image-share/media-image-share.module';
import { MediaObjectRelationModule } from 'src/modules/media-object-relation/media-object-relation.module';
import { MediaObjectModule } from 'src/modules/media-object/media-object.module';
import { MediaPermissionModule } from 'src/modules/media-permission/media-permission.module';
import { MediaRoleModule } from 'src/modules/media-role/media-role.module';
import { MediaSaleDepartmentModule } from 'src/modules/media-sale-department/media-sale-department.module';
import { MediaUserActionModule } from 'src/modules/media-user-action/media-user-action.module';
import { MediaUnitModule } from 'src/modules/media-unit/media-unit.module';
import { MediaUploadModule } from 'src/modules/media-upload/media-upload.module';
import { MediaColorxModule } from 'src/modules/media-colorx/media-colorx.module';

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
      MediaFolderModule,
      MediaActivityLogModule,
      MediaArticleModule,
      MediaImageShareModule,
      MediaObjectRelationModule,
      MediaObjectModule,
      MediaPermissionModule,
      MediaRoleModule,
      MediaSaleDepartmentModule,
      MediaSideModule,
      MediaUserActionModule,
      MediaArticleModule,
      MediaUnitModule,
      MediaUploadModule,
      MediaColorxModule,
    ],
  },
];
