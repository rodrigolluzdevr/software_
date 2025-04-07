import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(userData: Prisma.UserUncheckedCreateInput): Promise<User> {
    return this.prisma.user.create({
      data: userData,
    });
  }

  async updateUser(
    id: number,
    userData: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }



  // get all users
  async getAllUsersByOrganization(organizationId: number): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { organizationId },
    });
  }
  
  async getAllUsersByRegionIds(regionIds: number[]): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        regions: {
          some: {
            id: {
              in: regionIds,
            },
          },
        },
      },
    });
  }

  async getUsersBySchoolIds(schoolIds: number[]): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        schools: {
          some: {
            id: {
              in: schoolIds
            }
          }
        }
      }
    });
  }

  async getAllUsersByClassIds(classIds: number[]): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        class: {
          some: {
            id: {
              in: classIds,
            },
          },
        },
      },
    });
  }

  async getSchoolsByRegionIds(regionIds: number[]): Promise<any[]> {
    return this.prisma.school.findMany({
      where: {
        regionId: {
          in: regionIds
        }
      }
    });
  }

  async getClassesBySchoolIds(schoolIds: number[]): Promise<any[]> {
    return this.prisma.class.findMany({
      where: {
        schoolId: {
          in: schoolIds,
        },
      },
    });
  }

  // get ['id']

  async isUserInRegions(userId: number, regionIds: number[]): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: {
        id: userId,
        regions: {
          some: {
            id: {
              in: regionIds
            }
          }
        }
      }
    });
    return count > 0;
  }
  
  async isUserInSchools(userId: number, schoolIds: number[]): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: {
        id: userId,
        schools: {
          some: {
            id: {
              in: schoolIds
            }
          }
        }
      }
    });
    return count > 0;
  }
  
  async isUserInClasses(userId: number, classIds: number[]): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: {
        id: userId,
        class: {
          some: {
            id: {
              in: classIds
            }
          }
        }
      }
    });
    return count > 0;
  }

  // delete
  async isSchoolInRegions(schoolId: number, regionIds: number[]): Promise<boolean> {
    const count = await this.prisma.school.count({
      where: {
        id: schoolId,
        regionId: {
          in: regionIds
        }
      }
    });
    return count > 0;
  }

  async isClassInRegions(classId: number, regionIds: number[]): Promise<boolean> {
    const count = await this.prisma.class.count({
      where: {
        id: classId,
        school: {
          regionId: {
            in: regionIds
          }
        }
      }
    });
    return count > 0;
  }

  async isClassInSchools(classId: number, schoolIds: number[]): Promise<boolean> {
    const count = await this.prisma.class.count({
      where: {
        id: classId,
        schoolId: {
          in: schoolIds
        }
      }
    });
    return count > 0;
  }
}
