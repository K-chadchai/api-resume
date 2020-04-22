import {
  Controller,
  Inject,
  Body,
  InternalServerErrorException,
  Post,
  UseFilters,
  Get,
  Put,
  Req,
  Delete,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { catchError } from 'rxjs/operators';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(@Inject(`media.users`) private readonly svcMediaUsers: ClientKafka) {}
  //
  async onModuleInit() {
    this.svcMediaUsers.subscribeToResponseOf(`media.users`);
    await this.svcMediaUsers.connect();
  }
  //
  send(_action, value) {
    return this.svcMediaUsers.send(`media.users`, { _action, ...value }).pipe(
      catchError(err => {
        throw new InternalServerErrorException(err);
      }),
    );
  }

  // Create
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.send('createUser', createUserDto);
  }

  // Read
  @Get('/:employeeId')
  getUsers(@Req() { params, query }) {
    return this.send('getUsers', { ...params, ...query });
  }

  // Update
  @Put()
  updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.send('updateUser', { ...updateUserDto });
  }

  // Delete
  @Delete('/:employeeId')
  deleteUser(@Req() { params: { employeeId } }) {
    return this.send('deleteUser', { employeeId });
  }
}
