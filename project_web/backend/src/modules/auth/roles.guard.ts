import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // Se não houver roles definidas, permite o acesso
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Payload do token JWT

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Acesso negado: permissão insuficiente');
    }

    return true;
  }
}