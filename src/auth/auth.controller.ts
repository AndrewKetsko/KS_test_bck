import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { ReturnInterface } from './interfaces/return.interface';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/data_base/entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth_service: AuthService) {}

  @Post('/register')
  register(@Body() body: RegisterDto): Promise<ReturnInterface> {
    return this.auth_service.register(body);
  }

  @Post('/login')
  login(@Body() body: LoginDto): Promise<ReturnInterface> {
    return this.auth_service.login(body);
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  logout(@GetUser() user: User): Promise<ReturnInterface> {
    return this.auth_service.logout(user);
  }

  @UseGuards(AuthGuard)
  @Get('/current')
  current(@GetUser() user: User): ReturnInterface {
    return this.auth_service.current(user);
  }
}
