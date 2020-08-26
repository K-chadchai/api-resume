import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { DBAUTHOR } from 'src/app/app.constants';

interface IEmployee {
  EmployeeId: string;
  Fullname: string;
  Secrets: string;
  EmployeeLevel: string;
}

@Injectable()
export class UsersService {
  constructor(@InjectConnection(DBAUTHOR) private readonly connection: Connection) {}

  async findOne(userId: string) {
    const queryEmployee = `select em.[EmployeeId] as EmployeeId,
    em.[Fullname] as Fullname,
    sc.[Password] as Secrets,
    em.IsManagerLevel as EmployeeLevel
from [Employees] em,
    Secrets sc 
where em.EmployeeId = sc.EmployeeId 
and  em.EmployeeId = '${userId}'`;

    const employee: IEmployee[] = await this.connection.query(queryEmployee);
    if (!employee || employee.length !== 1) {
      throw new NotFoundException(`Not found EmployeeId=${userId}`);
    }
    return employee[0];
  }
}
