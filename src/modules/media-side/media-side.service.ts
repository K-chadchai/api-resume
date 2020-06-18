import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaSideEntity } from 'src/entities/media_side.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, createConnection } from 'typeorm';

interface IgetSides {
    paging: number,
    search: string
}
interface IgetSide {
    id: number,
}
interface IEditSide {
    id: string,
    side_name: string,
    description: string,
    created_user: string,
    created_time: Date,
    last_edidor: string,
    last_edited_time: Date
}

@Injectable()
export class MediaSideService extends TypeOrmCrudService<MediaSideEntity> {

    constructor(@InjectRepository(MediaSideEntity) repo) {
        super(repo)
    }

    //custom Api 

    async getSides(props: IgetSides) {

        const skip = (props.paging - 1) * 10 || 0
        console.log("skip" + skip)

        // Validate 
        // if (!props.paging) {
        //     this.throwBadRequestException('กรุณาตรวจสอบ paging')
        // }

        //process
        const Sides = MediaSideEntity;
        if (props.search) {
            console.log("ใส่ค้นหา")
            console.log(props.search)
            const Side = await this.repo.find({
                where: {
                    side_name: Like(`%${props.search}%`)
                },
                order: {
                    created_time: 'ASC'
                },
                skip: skip,
                take: 10
            });
            console.log(Side)
            return { Side }
        } else {
            console.log("ไม่ใส่ค้นหา")
            const Side = await this.repo.find({
                order: {
                    created_time: 'ASC'
                },
                skip: skip,
                take: 10
            });
            console.log(Side)
            return { Side }
        }
        return { Sides };
    }

    async getSide(props: IgetSide) {

        // Validate 
        console.log(props.id)
        if (!props.id) {
            this.throwBadRequestException('กรุณาตรวจสอบ id')
        }
        const Side = await this.repo.find({
            where: [
                { id: props.id }
            ]
        });
        //console.log(Side)
        return { Side };
    }

    async EditSide(props: IEditSide) {

        // Validate 
        if (!props.id) {
            this.throwBadRequestException('กรุณาตรวจสอบ id')
        }
        console.log(props.id)

        /*...*/
        let SideToUpdate: IEditSide = await this.repo.findOne({
            where: [
                { id: props.id }
            ]
        });

        console.log("การค้นหา" + SideToUpdate)
        if (SideToUpdate.id) {
            SideToUpdate.side_name = props.side_name;
            return await this.repo.save(SideToUpdate);
        }

        //console.log(Side)
        return {};
    }

}
