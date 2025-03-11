import { adminPermissions } from './admin.permissions';
import { secretaryPermissions } from './secretary.permissions';
import { coordinatorPermissions } from './coordinator.permissions';
import { directorPermissions } from './director.permissions';
import { teacherPermissions } from './teacher.permissions';
import { userPermissions } from './user.permissions';

export const permissions = {
  admin: adminPermissions,
  secretary: secretaryPermissions,
  coordinator: coordinatorPermissions,
  director: directorPermissions,
  teacher: teacherPermissions,
  user: userPermissions,
};