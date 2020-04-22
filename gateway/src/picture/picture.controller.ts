import { Controller, Inject, Get, InternalServerErrorException, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { catchError } from 'rxjs/operators';

@Controller('picture')
export class PictureController {
  constructor(@Inject(`media.picture`) private readonly svcMediaPicture: ClientKafka) {}
  //
  _getPicture = `media.picture.getPicture`;
  //
  async onModuleInit() {
    this.svcMediaPicture.subscribeToResponseOf(this._getPicture);
    await this.svcMediaPicture.connect();
  }
  //
  @Get()
  getPicture() {
    const sendTime = new Date().toISOString();
    console.log('sendTime', sendTime);
    const payload = { name: 'nikom', sendTime };
    return this.svcMediaPicture.send(this._getPicture, payload).pipe(
      catchError(err => {
        throw new InternalServerErrorException(err);
      }),
    );
  }
}
