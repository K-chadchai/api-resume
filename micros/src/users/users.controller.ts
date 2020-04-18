import { Controller, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { AppExceptions, AppService } from 'src/app.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { _KafkaMessage, _KafkaBrokers } from 'src/app.constants';

@Controller()
@UseFilters(new AppExceptions())
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly appService: AppService,
  ) {}
  //
  @MessagePattern(_KafkaMessage.users_createUser)
  async createUser(@Payload() { value }) {
    try {
      return await this.appService.execute(
        async (session) => await this.usersService.createUser(value, session),
      );
    } catch (error) {
      throw new RpcException(error.errmsg || error.message);
    }
  }
  //
  @MessagePattern(_KafkaMessage.users_getUsersAll)
  async getUsersAll() {
    return await this.usersService.getUsersAll();
  }
  //
  @MessagePattern(_KafkaMessage.users_updateUser)
  async updateUser(@Payload() { value }) {
    try {
      return await this.appService.execute(
        async (session) => await this.usersService.updateUser(value, session),
      );
    } catch (error) {
      throw new RpcException(error.errmsg || error.message);
    }
  }
}
