import {
  Controller,
  Inject,
  Body,
  InternalServerErrorException,
  Post,
  Get,
  Put,
  Req,
  Delete,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { catchError } from 'rxjs/operators';
import { _KafaModule } from 'src/app.constants';
import { IsNotEmpty } from 'class-validator';

const _kafkaName = _KafaModule.users;

class CreateUserDto {
  @IsNotEmpty()
  readonly employeeId: string;
  @IsNotEmpty()
  readonly name: string;
  @IsNotEmpty()
  readonly surname: string;
  readonly position: string;
  readonly role: string;
}

class UpdateUserDto {
  @IsNotEmpty()
  readonly employeeId: string;
  readonly name: string;
  readonly surname: string;
}

@Controller('users')
export class UsersController {
  constructor(@Inject(_kafkaName) private readonly svcMediaUsers: ClientKafka) {}
  //
  async onModuleInit() {
    this.svcMediaUsers.subscribeToResponseOf(_kafkaName);
    await this.svcMediaUsers.connect();
  }
  //
  send(_action, value = {}) {
    return this.svcMediaUsers.send(_kafkaName, { _action, ...value }).pipe(
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
