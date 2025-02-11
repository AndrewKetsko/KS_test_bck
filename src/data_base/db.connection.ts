import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Schedule } from './entity/schedule.entity';
import { User } from './entity/user.entity';

@Injectable()
export class DBConnection implements TypeOrmOptionsFactory {
  public createTypeOrmOptions():
    | Promise<TypeOrmModuleOptions>
    | TypeOrmModuleOptions {
    return {
      type: 'postgres',
      entities: [User, Schedule],
      synchronize: true,
      autoLoadEntities: true,
      ssl: { rejectUnauthorized: true },
      url: process.env.DB_URL,
    };
  }
}
