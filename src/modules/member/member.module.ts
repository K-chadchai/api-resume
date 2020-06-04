import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from 'src/entities/member.entity';

@Module({
    imports: [TypeOrmModule.forFeature([MemberEntity])],
    providers: [MemberService],
    controllers: [MemberController]
})
export class MemberModule { }
