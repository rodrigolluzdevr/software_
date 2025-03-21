import { Request } from 'express';

/**
 * Obtém o ID da primeira região do usuário
 */
export function getRegionIdFromRequest(req: Request): number {
  const regions = req.user?.regions || [];
  
  if (regions.length > 0) {
    return regions[0].id;
  }
  
  throw new Error('Usuário não possui regiões');
}

export function userHasAccessToRegion(req: Request, regionId: number): boolean {
  const regions = req.user?.regions || [];
  return regions.some(region => region.id === regionId);
}