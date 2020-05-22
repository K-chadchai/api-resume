/* eslint-disable @typescript-eslint/camelcase */
import {
  Controller,
  Post,
  Res,
  Req,
  Query,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Crud } from '@nestjsx/crud';
import { UsersEntity } from 'src/entities/users.entity';

@Crud({
  model: { type: UsersEntity },
  params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('users')
export class UsersController {
  constructor(public service: UsersService) {}

  @Get('login-token')
  loginToken(@Req() req) {
    // ถ้า user ถูก terminate ให้ userData = null
    const userData = req.headers.authorization;
    return { user: userData };
  }

  // Login success
  @Post('login-succss')
  loginSuccess() {
    return null;
  }

  // Upload user picture
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

  // Get uesr picture
  @Get('image')
  async getImage(@Query('employee_id') employee_id) {
    try {
      return await this.service.getImage(employee_id);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
