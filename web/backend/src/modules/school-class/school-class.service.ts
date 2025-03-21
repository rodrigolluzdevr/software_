import { Injectable } from '@nestjs/common';
import { Class } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ClassService {
    constructor(private prisma: PrismaService) {}


    async getAllClass(): Promise<Class[]> {
        return this.prisma.class.findMany();
    }
}
