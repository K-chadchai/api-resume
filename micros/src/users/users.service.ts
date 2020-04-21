import { Injectable } from '@nestjs/common';
import { _MongoTables, _KafkaMessage } from 'src/app.constants';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor() {}
  //
  async createUser(value, session) {}
  //
  async getUsersAll() {}
  //
  async updateUser(value, session) {}
}
