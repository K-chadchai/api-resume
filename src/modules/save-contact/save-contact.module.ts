import { Module } from '@nestjs/common';
import { SaveContactService } from './save-contact.service';
import { SaveContactController } from './save-contact.controller';

@Module({
  providers: [SaveContactService],
  controllers: [SaveContactController]
})
export class SaveContactModule {}
