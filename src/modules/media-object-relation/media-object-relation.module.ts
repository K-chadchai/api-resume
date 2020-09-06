import { Module } from '@nestjs/common';
import { MediaObjectRelationService } from './media-object-relation.service';
import { MediaObjectRelationController } from './media-object-relation.controller';
import { AppService } from 'src/app/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaObjectRelationEntity } from 'src/entities/media_object_relation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaObjectRelationEntity])],
  providers: [MediaObjectRelationService, AppService],
  controllers: [MediaObjectRelationController],
})
export class MediaObjectRelationModule {}
