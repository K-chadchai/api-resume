import { Module } from '@nestjs/common';
import { SaveContactService } from './save-contact.service';
import { SaveContactController } from './save-contact.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaveContactEntity } from 'src/entities/save-contact.entity';
import { AppService } from 'src/app/app.service';

@Module({
  imports: [TypeOrmModule.forFeature([SaveContactEntity])],
  providers: [SaveContactService, AppService],
  controllers: [SaveContactController],
})
export class SaveContactModule {}
