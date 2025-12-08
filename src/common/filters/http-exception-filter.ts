import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (typeof errorResponse === 'object' && errorResponse !== null) {
        message =
          (errorResponse as any).message || (errorResponse as any).error;
      } else if (typeof errorResponse === 'string') {
        message = errorResponse;
      }
    } else if (exception instanceof QueryFailedError) {
      if ((exception as any).code === '23505') {
        status = HttpStatus.CONFLICT;
        message = 'Duplicate entry detected';
      } else {
        message = 'Database query failed';
      }
    } else if (exception instanceof Error) {
      const errorMsg = exception.message;

      if (errorMsg.includes('ECONNREFUSED')) {
        message = 'Database connection refused';
      } else if (
        errorMsg.includes('relation') &&
        errorMsg.includes('does not exist')
      ) {
        message = 'Database table missing';
      } else {
        // For random JS errors (SyntaxError, etc), keep default 500
        message = errorMsg;
      }
    }

    if (status >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url}`,
        exception instanceof Error ? exception.stack : exception,
      );
    } else {
      this.logger.warn(`[${request.method}] ${request.url} - ${message}`);
    }
    response.status(status).json({
      success: false,
      message,
      code: status,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
