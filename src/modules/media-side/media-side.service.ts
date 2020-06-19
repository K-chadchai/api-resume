import { Injectable, BadRequestException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaSideEntity } from 'src/entities/media_side.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, QueryRunner } from 'typeorm';
import { AppService } from 'src/app/app.service';

interface IgetSides {
    paging: number,
    search: string
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

    constructor(
        @InjectRepository(MediaSideEntity) repo,
        private readonly appService: AppService,
    ) {
        super(repo);
    }

    //custom Api 

    async getSides(props: IgetSides) {

        const skip = (props.paging - 1) * 10 || 0
        console.log("skip" + skip)

        // Validate 

        //process
        return await this.appService.dbRunner(async (runner: QueryRunner) => {

            const Sides = MediaSideEntity;
            if (props.search) {
                console.log("ใส่ค้นหา")
                console.log(props.search)
                const Side = await runner.manager.find(MediaSideEntity, {
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
                const Side = await runner.manager.find(MediaSideEntity, {
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
        });
    }

    async getSide(id: string) {

        // Validate 
        console.log(id)
        if (!id) {
            this.throwBadRequestException('กรุณาตรวจสอบ id')
        }
        return await this.appService.dbRunner(async (runner: QueryRunner) => {

            const Side = await runner.manager.find(MediaSideEntity, {
                where: [
                    { id: id }
                ]
            });
            return { Side };
        });
    }

    async EditSide(query: IEditSide) {

        console.log("id :" + query.id)
        return await this.appService.dbRunner(async (runner: QueryRunner) => {
            //
            console.log("เข้าฟังชั่น อัพเดท", query)
            const SideToUpdate: MediaSideEntity = await runner.manager.findOne(MediaSideEntity, {
                where: [
                    { id: query.id }
                ]
            })
            console.log('SideToUpdate >>', SideToUpdate)
            if (!SideToUpdate.id) {
                throw new BadRequestException(
                    `ไม่พบข้อมูล id :(${query.id}) ,กรุณาตรวจสอบ`,
                );
            }
            //
            SideToUpdate.side_name = query.side_name;
            SideToUpdate.description = query.description;
            SideToUpdate.last_edidor = query.last_edidor;
            SideToUpdate.last_edited_time = query.last_edited_time;

            console.log("ค่า side_name" + query.side_name)
            const Sides = await runner.manager.save(MediaSideEntity, SideToUpdate);
            // this.throwBadRequestException("555");
            return Sides;
        });
    }

    async DeleteSide(id: string) {

        console.log("Delete id :" + id)
        return await this.appService.dbRunner(async (runner: QueryRunner) => {
            //
            const SideToUpdate: MediaSideEntity = await runner.manager.findOne(MediaSideEntity, {
                where: [
                    { id: id }
                ]
            })
            if (!SideToUpdate.id) {
                throw new BadRequestException(
                    `ไม่พบข้อมูล id :(${id}) ,กรุณาตรวจสอบ`,
                );
            }
            //
            console.log("ข้อมูลค้นหา :" + SideToUpdate.id)
            const Sides = await runner.manager.remove(MediaSideEntity, SideToUpdate);
            // this.throwBadRequestException("555");
            return Sides;

        });
    }

    async SaveSide(query: MediaSideEntity) {

        query.created_time = new Date();
        query.last_edited_time = new Date();

        return this.repo.save(query)

        // console.log("id :" + query.id)
        // return await this.appService.dbRunner(async (runner: QueryRunner) => {
        //     //
        //     //
        //     const Sides = await runner.manager.save(MediaSideEntity, query);


        //     // this.throwBadRequestException("555");
        //     return Sides;
        // });
    }
}