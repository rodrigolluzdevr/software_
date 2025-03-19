import { Request } from 'express';

export function getRegionIdFromRequest(req: Request): number {
  return req.user.regionIds;
}