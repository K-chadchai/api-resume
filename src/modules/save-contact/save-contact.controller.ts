import { Body, Controller, Get, Post } from '@nestjs/common';
import { SaveDto } from './save-contact.dto';
import { SaveContactService } from './save-contact.service';

@Controller('save-contact')
export class SaveContactController {
  constructor(public service: SaveContactService) {}

  @Get('')
  getContact() {
    return this.service.getContact();
  }

  @Post('')
  save(@Body() dto: SaveDto) {
    return this.service.save(dto);
  }
}
