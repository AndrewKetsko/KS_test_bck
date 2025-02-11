import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/data_base/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt_service: JwtService,
    @InjectRepository(User) private readonly user_repository: Repository<User>,
  ) {}

  private extractTokenFromHeader(request): string | undefined {
    const [type, token] = request.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException();
    }

    let user: User;
    try {
      const payload = await this.jwt_service.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      user = await this.user_repository.findOneByOrFail({
        email: payload.email,
      });
    } catch (error) {
      throw new UnauthorizedException();
    }
    req['user'] = user;
    return true;
  }
}
