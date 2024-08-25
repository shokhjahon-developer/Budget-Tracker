import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        const user = this.jwtService.verify(token, {
          secret: this.configService.get('JWT_SECRET_KEY'),
        });
        request.user = user;
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}
