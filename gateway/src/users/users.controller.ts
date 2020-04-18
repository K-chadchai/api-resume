import {
  Controller,
  Inject,
  Body,
  InternalServerErrorException,
  Post,
  UseFilters,
  Get,
  Put,
} from '@nestjs/common';
import { _KafkaModule, _KafkaMessage } from 'src/app.constants';
import { ClientKafka } from '@nestjs/microservices';
import { catchError } from 'rxjs/operators';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(@Inject(_KafkaModule.users) private readonly svcMediaUsers: ClientKafka) {}
  //
  async onModuleInit() {
    this.svcMediaUsers.subscribeToResponseOf(_KafkaMessage.users_createUser);
    this.svcMediaUsers.subscribeToResponseOf(_KafkaMessage.users_getUsersAll);
    this.svcMediaUsers.subscribeToResponseOf(_KafkaMessage.users_updateUser);
    await this.svcMediaUsers.connect();
  }
  //
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.svcMediaUsers.send(_KafkaMessage.users_createUser, createUserDto).pipe(
      catchError(err => {
        throw new InternalServerErrorException(err);
      }),
    );
  }
  //
  @Get()
  getUsersAll() {
    return this.svcMediaUsers.send(_KafkaMessage.users_getUsersAll, {}).pipe(
      catchError(err => {
        throw new InternalServerErrorException(err);
      }),
    );
  }
  //
  @Put()
  updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.svcMediaUsers.send(_KafkaMessage.users_updateUser, updateUserDto).pipe(
      catchError(err => {
        throw new InternalServerErrorException(err);
      }),
    );
  }
}
