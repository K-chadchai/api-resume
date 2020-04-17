import { Controller, Inject, Get, InternalServerErrorException, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { catchError } from 'rxjs/operators';
import { _KafkaModule, _KafkaMessage } from 'src/app.constants';

@Controller()
export class PictureController {
  constructor(@Inject(_KafkaModule.picture) private readonly svcMedia: ClientKafka) {}
  //
  async onModuleInit() {
    this.svcMedia.subscribeToResponseOf(_KafkaMessage.picture_getPicture);
    await this.svcMedia.connect();
  }
  //
  @Get()
  getPicture() {
    const sendTime = new Date().toISOString();
    console.log('sendTime', sendTime);
    const payload = { name: 'nikom', sendTime };
    return this.svcMedia.send(_KafkaMessage.picture_getPicture, payload).pipe(
      catchError(err => {
        throw new InternalServerErrorException(err);
      }),
    );
  }
}
