import { Module } from '@nestjs/common';
import { MediaUnitService } from './media-unit.service';
import { MediaUnitController } from './media-unit.controller';
import { AppService } from 'src/app/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaUnitEntity } from 'src/entities/media_unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaUnitEntity])],
  providers: [MediaUnitService, AppService],
  controllers: [MediaUnitController],
})
export class MediaUnitModule {}
