import { Module } from '@nestjs/common';
import { MediaUserActionService } from './media-user-action.service';
import { MediaUserActionController } from './media-user-action.controller';
import { AppService } from 'src/app/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaUserActionEntity } from 'src/entities/media_user_action.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MediaUserActionEntity])],
  providers: [MediaUserActionService, AppService],
  controllers: [MediaUserActionController]
})
export class MediaUserActionModule { }
