import { Controller, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { AppExceptions, AppService } from 'src/app.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { _KafkaBrokers, _KafaModule } from 'src/app.constants';

@Controller()
@UseFilters(new AppExceptions())
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly appService: AppService,
  ) {}

  @MessagePattern(_KafaModule.users)
  async action(@Payload() payload) {
    try {
      const { _action, ...value } = payload.value;
      return await this.appService.mongoSession(async (session) => {
        switch (_action) {
          case `createUser`:
            return await this.usersService.createUser(value, session);
          case `getUsers`:
            return await this.usersService.getUsers(value);
          case `updateUser`:
            return await this.usersService.updateUser(value, session);
          case `deleteUser`:
            return await this.usersService.deleteUser(value, session);
          default:
            throw new RpcException(`Not in case, ${_action}`);
        }
      });
    } catch (error) {
      throw new RpcException(error.errmsg || error.message);
    }
  }
}
