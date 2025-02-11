import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // delete data.status;
        this.delete_entries(data);
        return data;
      }),
    );
  }

  delete_entries(obj: any) {
    try {
      if (typeof obj !== 'object') {
        return;
      }
      //on any
      delete obj.password;

      Object.values(obj).forEach((el) => {
        if (!el) {
          return;
        }
        if (Array.isArray(el)) {
          el.forEach((sub) => this.delete_entries(sub));
        }
        if (Object.keys(el)[0] !== '0') {
          this.delete_entries(el);
        }
      });
    } catch (error) {
      console.log('ResponseInterceptor ERROR: ', error.message);
    }
  }
}
