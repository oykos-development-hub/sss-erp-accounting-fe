export interface RoutePermission {
  title: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  route: string;
}
export const permissionActions = ['read', 'create', 'update', 'delete'] as const;
export type PermissionAction = (typeof permissionActions)[number];

export function checkRoutePermissions(permissions: RoutePermission[]): string[] {
  const allowedRoutes: string[] = [];

  if (permissions?.length) {
    permissions.forEach(permission => {
      if (permission?.read && permission?.route) allowedRoutes.push(permission.route);
    });
  }

  return allowedRoutes;
}

export function checkActionRoutePermissions(permissions: RoutePermission[], action: PermissionAction): string[] {
  const allowedRoutes: string[] = [];

  if (permissions?.length) {
    permissions.forEach(permission => {
      if (permission && permission[action] && permission.route) allowedRoutes.push(permission.route);
    });
  }

  return allowedRoutes;
}
