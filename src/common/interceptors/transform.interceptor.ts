import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';
import { map } from 'rxjs/operators';

export type Response<T> = {
  success: boolean;
  message: string;
  code: number;
  data: T;
};

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> | Promise<Observable<Response<T>>> {
    const handler = context.getHandler();

    const message =
      this.reflector.get<string>(RESPONSE_MESSAGE_KEY, handler) ||
      'Operation successful';

    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: message,
        code: context.switchToHttp().getResponse().statusCode,
        data,
      })),
    );
  }
}
