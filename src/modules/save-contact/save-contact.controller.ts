import { Controller, Get } from '@nestjs/common';
import { SaveContactService } from './save-contact.service';

@Controller('save-contact')
export class SaveContactController {
  constructor(public service: SaveContactService) {}

  @Get('')
  getContact() {
    return this.service.getContact();
  }
}
