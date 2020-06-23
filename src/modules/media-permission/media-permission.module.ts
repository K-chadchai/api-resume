import { Module } from '@nestjs/common';
import { MediaPermissionService } from './media-permission.service';
import { MediaPermissionController } from './media-permission.controller';
import { AppService } from 'src/app/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaPermissionEntity } from 'src/entities/media_permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaPermissionEntity])],
  providers: [MediaPermissionService, AppService],
  controllers: [MediaPermissionController]
})
export class MediaPermissionModule { }
