/* eslint-disable @typescript-eslint/camelcase */
import { Controller, Post, Res, Req, Query, Get } from '@nestjs/common';
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

  @Post('image')
  async postImage(@Req() req, @Res() res, @Query() query) {
    try {
      return await this.service.postImage(req, res, query);
    } catch (error) {
      return res
        .status(500)
        .json(`Failed to upload user image : ${error.message}`);
    }
  }

  // @Get('image-key/:employee_id')
  @Get('image')
  async getImage(@Query('employee_id') employee_id) {
    return await this.service.getImage(employee_id);
  }
}
