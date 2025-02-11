import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class DBConnection implements TypeOrmOptionsFactory {
  public createTypeOrmOptions():
    | Promise<TypeOrmModuleOptions>
    | TypeOrmModuleOptions {
    return {
      type: 'postgres',
      entities: [__dirname + '/entity/*.entity.ts'],
      synchronize: true,
      autoLoadEntities: true,
      ssl: { rejectUnauthorized: true },
      url: process.env.DB_URL,
    };
  }
}
