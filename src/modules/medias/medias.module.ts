import { Module } from '@nestjs/common';
import { MediasService } from './medias.service';
import { MediasController } from './medias.controller';
import { AppService } from 'src/app/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediasEntity } from 'src/entities/medias.entity';
import { UploaderService } from 'src/services/uploader.service';

@Module({
  imports: [TypeOrmModule.forFeature([MediasEntity])],
  providers: [MediasService, AppService, UploaderService],
  exports: [MediasService],
  controllers: [MediasController],
})
export class MediasModule {}
