import {
  Controller,
  Inject,
  Body,
  InternalServerErrorException,
  Post,
  UseFilters,
} from '@nestjs/common';
import { _KafkaModule, _KafkaMessage } from 'src/app.constants';
import { ClientKafka } from '@nestjs/microservices';
import { catchError } from 'rxjs/operators';
import { CreateUserDto } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(@Inject(_KafkaModule.users) private readonly svcMediaUsers: ClientKafka) {}
  //
  async onModuleInit() {
    this.svcMediaUsers.subscribeToResponseOf(_KafkaMessage.users_createUser);
    await this.svcMediaUsers.connect();
  }
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    // console.log('createUserDto:', createUserDto);
    return this.svcMediaUsers.send(_KafkaMessage.users_createUser, createUserDto).pipe(
      catchError(err => {
        throw new InternalServerErrorException(err);
      }),
    );
  }
}
