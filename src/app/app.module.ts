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
import { MediaFolderModule } from 'src/modules/media-folder/media-folder.module';
import { MediaActivityLogModule } from 'src/modules/media-activity-log/media-activity-log.module';
import { MediaArticleModule } from 'src/modules/media-article/media-article.module';
import { MediaImageShareModule } from 'src/modules/media-image-share/media-image-share.module';
import { MediaObjectRelationModule } from 'src/modules/media-object-relation/media-object-relation.module';
import { MediaObjectModule } from 'src/modules/media-object/media-object.module';
import { MediaPermissionModule } from 'src/modules/media-permission/media-permission.module';
import { MediaRoleModule } from 'src/modules/media-role/media-role.module';
import { MediaSaleDepartmentModule } from 'src/modules/media-sale-department/media-sale-department.module';
import { MediaUnitModule } from 'src/modules/media-unit/media-unit.module';
import { MediaUserActionModule } from 'src/modules/media-user-action/media-user-action.module';
import { MediaUploadModule } from 'src/modules/media-upload/media-upload.module';
import { MediaColorxModule } from 'src/modules/media-colorx/media-colorx.module';
import { MediaResolutionModule } from 'src/modules/media-resolution/media-resolution.module';

@Module({
  imports: [
    EasyconfigModule.register({}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      name: 'mssql',
      host: process.env.DB_MSSQL_HOST,
      username: process.env.DB_MSSQL_USERNAME,
      password: process.env.DB_MSSQL_PASSWORD,
      database: 'DBMASTER',
      entities: ['dist/**/*.entity{.ts,.js}'],
      options: { enableArithAbort: true },
      // synchronize: true,
    }),

    RouterModule.forRoutes(routes),
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
    MediaFolderModule,
    MediaImageShareModule,
    MediaObjectRelationModule,
    MediaObjectModule,
    MediaPermissionModule,
    MediaRoleModule,
    MediaSaleDepartmentModule,
    MediaSideModule,
    MediaUnitModule,
    MediaUserActionModule,
    MediaUploadModule,
    MediaColorxModule,
    MediaResolutionModule,
  ],
  providers: [],
})
export class AppModule {}
