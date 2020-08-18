import { Injectable, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { IEmployeeEntity } from 'src/interfaces/employees';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import * as aws from 'aws-sdk';
import * as constants from 'src/app/app.constants';
import { JwtAuthGuard } from './jwt-auth.guard';

interface IGetPayload {
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectConnection('mssql')
    private readonly connection: Connection,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    //call service Encrypt Password
    const verifyUserPassword = await axios
      .post(`${process.env.VERIFY_USERPASS}`, {
        text: pass,
        key: 'UW',
      })
      .then((response) => {
        if (response.data) {
          return response.data;
        } else {
          throw new InternalServerErrorException('Not found username');
        }
      })
      .catch((err) => {
        console.error(err);
        throw new InternalServerErrorException('Not found username');
      });

    const { Secrets } = user;
    if (user && Secrets.trim() === verifyUserPassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // User Verify
    const payload = { uuid: uuid(), EmployeeId: user.EmployeeId, Fullname: user.Fullname };

    //Save to DynamoDB

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async getValidate(body) {
    if (!body.token && !body.key) throw new InternalServerErrorException('กรุณาตรวจสอบข้อมูล');

    //Check DynamoDB
    //uuid find token and check date exp

    //Decoded
    var userObject = await this.JWTDecodeAuth(body.token);

    //Check DBAuther Get Role
    let query = `Select
    DISTINCT rl.Reference, ac.ActionCode ,
    Status
  from
    [Policy_Actions] ac
    join [Roles] rl ON ac.RoleId = rl.RoleId
  WHERE
    ProgramKey = '${body.key}'
    AND rl.RoleId IN (
      SELECT
        Roles_RoleId
      FROM
        Employees_Roles
    WHERE
      Employees_EmployeeId = ${userObject.EmployeeId} )`;

    //Save Role to DynamoDB

    return this.connection.query(query);
  }

  async JWTDecodeAuth(token: string) {
    var jwt = require('jsonwebtoken');
    const secret = constants.APP_SECRET_KEY;
    var decoded = jwt.verify(token, secret);
    return decoded;
  }
}
