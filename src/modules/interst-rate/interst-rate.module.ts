import { Module } from '@nestjs/common';
import { InterstRateService } from './interst-rate.service';
import { InterstRateController } from './interst-rate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterstRateEntity } from 'src/entities/interst_rate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InterstRateEntity])],
  providers: [InterstRateService],
  controllers: [InterstRateController]
})
export class InterstRateModule { }
