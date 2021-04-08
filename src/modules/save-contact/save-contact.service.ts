import { BadRequestException, Injectable } from '@nestjs/common';
import { AppService } from 'src/app/app.service';
import { SaveContactEntity } from 'src/entities/save-contact.entity';
import { QueryRunner } from 'typeorm';
import { SaveDto } from './save-contact.dto';

@Injectable()
export class SaveContactService {
  constructor(private appService: AppService) {}
  getContact() {
    console.log(`call api`);
    return 'Hello';
  }

  async save(dto: SaveDto) {
    const { email } = dto;
    return await this.appService.dbRunner(async (runner: QueryRunner) => {
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!re.test(email)) {
        throw new BadRequestException('กรุณาใส่ email ให้ถูกต้อง');
      }

      return await runner.manager.save(SaveContactEntity, dto);
    });
  }
}
