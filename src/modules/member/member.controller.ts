import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { MemberEntity } from 'src/entities/member.entity';
import { MemberService } from './member.service';

@Crud({
    model: { type: MemberEntity },
    params: { id: { field: 'id', type: 'uuid', primary: true } },
})
@Controller('member')
export class MemberController {
    constructor(public service: MemberService) { }
}
