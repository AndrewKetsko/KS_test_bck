import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/data_base/entity/user.entity';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): Promise<User> => {
    const req = ctx.switchToHttp().getRequest();
    if (data) {
      return req.user[data];
    }
    return req.user;
  },
);
