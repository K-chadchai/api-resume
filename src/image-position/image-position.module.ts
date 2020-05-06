import { Module } from '@nestjs/common';
import { ImagePositionService } from './image-position.service';
import { ImagePositionController } from './image-position.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagePostitionEntity } from 'src/entities/image-position.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImagePostitionEntity])],
  providers: [ImagePositionService],
  controllers: [ImagePositionController],
})
export class ImagePositionModule {}
