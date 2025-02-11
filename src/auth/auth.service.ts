import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/data_base/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { ReturnInterface } from './interfaces/return.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly user_repository: Repository<User>,
    private readonly jwt_service: JwtService,
  ) {}

  async register({
    username,
    email,
    password,
  }: RegisterDto): Promise<ReturnInterface> {
    let user: User;

    try {
      user = await this.user_repository.findOneBy({ email });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (user) {
      throw new BadRequestException('email in use');
    }

    try {
      const hashed_pass = await bcrypt.hash(password, 10);
      this.user_repository.insert({
        username,
        email,
        password: hashed_pass,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    return { status: 201, data: { user: { username, email } } };
  }

  async login({ email, password }: LoginDto): Promise<ReturnInterface> {
    let user: User;

    try {
      user = await this.user_repository.findOneBy({ email });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const compare_pass = await bcrypt.compare(password, user.password);

    if (!compare_pass) {
      throw new NotFoundException('user not found');
    }

    const jwt_payload = { email, username: user.username };

    user.token = this.jwt_service.sign(jwt_payload, {
      secret: process.env.JWT_SECRET,
    });

    try {
      await this.user_repository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    return { status: 200, data: { user } };
  }

  async logout(user: User): Promise<ReturnInterface> {
    user.token = null;
    try {
      await this.user_repository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    return { status: 201, data: { msg: 'ok' } };
  }

  current(user: User): ReturnInterface {
    return { status: 200, data: { user } };
  }
}
