import { Module } from '@nestjs/common';
import { MediaActivityLogService } from './media-activity-log.service';
import { MediaActivityLogController } from './media-activity-log.controller';
import { AppService } from 'src/app/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaActivityLogEntity } from 'src/entities/media_activity_log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaActivityLogEntity])],
  providers: [MediaActivityLogService, AppService],
  controllers: [MediaActivityLogController]
})
export class MediaActivityLogModule { }
