import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DBConnection } from './data_base/db.connection';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/responce.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({ useClass: DBConnection }),
    HealthModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    AppService,
  ],
})
export class AppModule {}
