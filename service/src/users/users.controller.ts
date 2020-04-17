import { Controller, UseFilters, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { AppExceptions } from 'src/app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { _KafkaMessage } from 'src/app.constants';
import { CreateUserDto, TUsersInterface } from './users.schema';

@Controller()
@UseFilters(new AppExceptions())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  //
  @MessagePattern(_KafkaMessage.users_createUser)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }
  //
  @MessagePattern(_KafkaMessage.users_getUsersAll)
  async getUsersAll(): Promise<TUsersInterface[]> {
    return this.usersService.getUsersAll();
  }
}
