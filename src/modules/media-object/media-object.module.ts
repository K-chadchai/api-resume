import { Module } from '@nestjs/common';
import { MediaObjectService } from './media-object.service';
import { MediaObjectController } from './media-object.controller';
import { AppService } from 'src/app/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaObjectEntity } from 'src/entities/media_object.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaObjectEntity])],
  providers: [MediaObjectService, AppService],
  controllers: [MediaObjectController],
})
export class MediaObjectModule {}
