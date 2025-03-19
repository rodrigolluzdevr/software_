import { Injectable } from '@nestjs/common';
import { Prisma, School } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class SchoolService {
    constructor(private prisma: PrismaService) {}

    async getAllSchools(regionId: number): Promise<School[]> {
        return this.prisma.school.findMany({
            where: { regionId },
        });
    }
}
