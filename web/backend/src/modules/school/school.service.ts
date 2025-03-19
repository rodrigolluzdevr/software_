import { Injectable } from '@nestjs/common';
import { School } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class SchoolService {
    constructor(private prisma: PrismaService) {}

    async getAllSchools(regionIds: number[]): Promise<School[]> {
        return this.prisma.school.findMany({
            where: {
                regionId: {
                    in: regionIds
                }
            },
        });
    }
}