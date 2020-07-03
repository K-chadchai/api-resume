import { Module } from '@nestjs/common';
import { MediaRoleService } from './media-role.service';
import { MediaRoleController } from './media-role.controller';
import { AppService } from 'src/app/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaRoleEntity } from 'src/entities/media_role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaRoleEntity])],
  providers: [MediaRoleService, AppService],
  controllers: [MediaRoleController]
})
export class MediaRoleModule { }
