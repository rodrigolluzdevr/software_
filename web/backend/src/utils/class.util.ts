import { Request } from 'express';
import { ForbiddenException } from '@nestjs/common';

export function getRegionIdFromRequest(req: Request): number {
  const regions = req.user?.regions || [];

  if (!regions.length) {
    throw new ForbiddenException('Usuário não possui regiões associadas');
  }

  return regions[0].id;
}

export function userHasAccessToSchool(req: Request, schoolId: number): boolean {
  const schools = req.user?.schools || [];
  return schools.some((region) => region.id === schoolId);
}
