import { Request } from 'express';

export function getOrganizationIdFromRequest(req: Request): number {
  return req.user.organizationId;
}