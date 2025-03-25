import { Request } from 'express';
import { ForbiddenException } from '@nestjs/common';

export function getRegionIdFromRequest(req: Request): number {
  const schools = req.user?.schools || [];

  if (!schools.length) {
    throw new ForbiddenException('Usuário não possui escolas associadas');
  }

  return schools[0].id;
}

export function userHasAccessToSchool(req: Request, schoolId: number): boolean {
  const schools = req.user?.schools || [];
  return schools.some(school => school.id === schoolId);
}
