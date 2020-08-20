import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { IEmployeeEntity } from 'src/interfaces/employees';

export type User = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection('mssql')
    private readonly connection: Connection,
  ) {}

  async findOne(userId: string): Promise<User | undefined> {
    const queryEmployee = `select em.[EmployeeId] as EmployeeId,
    em.[Fullname] as Fullname,
    sc.[Password] as Secrets,
    em.IsManagerLevel as EmployeeLevel
from [Employees] em,
    Secrets sc 
where em.EmployeeId = sc.EmployeeId 
and  em.EmployeeId = '${userId}'`;

    const employee: IEmployeeEntity[] = await this.connection.query(queryEmployee);
    if (!employee || employee.length !== 1) {
      throw new NotFoundException(`Not found EmployeeId=${userId}`);
    }
    return employee[0];
    //return this.users.find((user) => user.username === username);
  }
}
