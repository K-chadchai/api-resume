import { Controller, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { AppExceptions } from 'src/app.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { _KafkaMessage } from 'src/app.constants';
import { TUsersInterface } from './users.schema';

@Controller()
@UseFilters(new AppExceptions())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  //
  @MessagePattern(_KafkaMessage.users_createUser)
  async createUser(@Payload() { value }) {
    try {
      return await this.usersService.createUser(value);
    } catch (error) {
      throw new RpcException(error.errmsg);
    }
  }
  //
  @MessagePattern(_KafkaMessage.users_getUsersAll)
  async getUsersAll(): Promise<TUsersInterface[]> {
    return this.usersService.getUsersAll();
  }
}
