import { Request } from 'express';

export function getOrganizationIdFromRequest(req: Request): number {
  return req.user.organizationId;
}

export function userHasAccessToOrganization(req: Request, organizationId: number): boolean {
  return req.user.organizationId === organizationId;
}