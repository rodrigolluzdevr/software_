import { permissions } from "./permissions/index";


export function canCreate(userRole: string, entity: string): boolean {
  return permissions[userRole]?.create?.includes(entity) || false;
}

export function canView(userRole: string, entity: string): boolean {
  return permissions[userRole]?.view?.includes(entity) || false;
}

export function canLink(userRole: string, entity: string): boolean {
  return permissions[userRole]?.link?.includes(entity) || false;
}