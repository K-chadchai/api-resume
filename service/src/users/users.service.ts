import { Injectable, UseFilters } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AppExceptions } from 'src/app.service';
import { CreateUserDto, TUsersInterface } from './users.schema';
import { _MongoTables } from 'src/app.constants';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
@UseFilters(new AppExceptions())
export class UsersService {
  constructor(
    @InjectModel(_MongoTables.users)
    private tUsersModel: Model<TUsersInterface>,
  ) {}
  //
  async createUser(createUserDto: CreateUserDto) {
    const tUsersModel = new this.tUsersModel(createUserDto);
    await tUsersModel.save();
  }
  //
  async getUsersAll(): Promise<TUsersInterface[]> {
    return this.tUsersModel.find().exec();
  }
}
