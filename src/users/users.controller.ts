import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { Crud } from '@nestjsx/crud';
import { UsersEntity } from 'src/entities/users.entity';

@Crud({
  model: {
    type: UsersEntity,
  },
})
@Controller('users')
export class UsersController {
  constructor(public service: UsersService) {}
}
