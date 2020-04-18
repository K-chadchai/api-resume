import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PictureService } from './picture.service';
import { AppExceptions } from 'src/app.service';
import { _KafkaMessage } from 'src/app.constants';

@Controller()
@UseFilters(new AppExceptions())
export class PictureController {
  constructor(private readonly pictureService: PictureService) {}
  //
  @MessagePattern(_KafkaMessage.picture_getPicture)
  getPicture(@Payload() payload) {
    return this.pictureService.getPicture(payload.value);
  }
}
