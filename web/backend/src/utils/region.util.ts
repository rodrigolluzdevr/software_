import { Request } from 'express';
import { ForbiddenException } from '@nestjs/common';

export function getRegionIdFromRequest(req: Request): number {
  const regions = req.user?.regions || [];
  
  if (!regions.length) {
    throw new ForbiddenException('Usuário não possui regiões associadas');
  }
  
  return regions[0].id;
}

export function userHasAccessToRegion(req: Request, regionId: number): boolean {
  const regions = req.user?.regions || [];
  return regions.some(region => region.id === regionId);
}