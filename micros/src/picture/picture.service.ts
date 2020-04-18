import { Injectable, UseFilters } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AppExceptions } from 'src/app.service';

@Injectable()
@UseFilters(new AppExceptions())
export class PictureService {
  //
  getPicture({ name, sendTime }) {
    const receiveTime = new Date().toISOString();
    console.log('receiveTime', receiveTime);
    // > Test error
    if (sendTime.endsWith('9Z'))
      throw new RpcException(`Error Service : ${sendTime}`);
    //
    return { name, sendTime, receiveTime, iam: 'microservice' };
  }
}
