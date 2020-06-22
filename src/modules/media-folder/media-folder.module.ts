import { Module } from '@nestjs/common';
import { MediaFolderController } from './media-folder.controller';
import { MediaFolderService } from './media-folder.service';
import { AppService } from 'src/app/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaFolderEntity } from 'src/entities/media_folder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaFolderEntity])],
  controllers: [MediaFolderController],
  providers: [MediaFolderService, AppService]
})
export class MediaFolderModule { }
