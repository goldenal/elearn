import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

interface AuthenticatedUser {
  id: string;
}

@Injectable()
export class UserIsSelfGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: AuthenticatedUser }>();
    const userId = request.user.id;
    const paramId = request.params.id;

    return userId === paramId;
  }
}
