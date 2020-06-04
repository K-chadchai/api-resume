import { Injectable, Inject } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MemberEntity } from 'src/entities/member.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MemberService extends TypeOrmCrudService<MemberEntity> {
    constructor(@InjectRepository(MemberEntity) repo) {
        super(repo)
    }
}
