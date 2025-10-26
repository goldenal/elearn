import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    if (!request || !response) {
      return next.handle();
    }

    const { method, originalUrl, params, query } = request;
    const sanitizedBody = this.sanitizePayload(
      request.body as Record<string, any>,
    );
    const start = Date.now();

    this.logger.log(
      `Incoming ${method} ${originalUrl} | params=${JSON.stringify(
        params,
      )} query=${JSON.stringify(query)} body=${JSON.stringify(sanitizedBody)}`,
    );

    return next.handle().pipe(
      tap({
        next: (data: unknown) => {
          const duration = Date.now() - start;
          this.logger.log(
            `Outgoing ${method} ${originalUrl} ${response.statusCode} | ${duration}ms | response=${JSON.stringify(
              this.sanitizePayload(data),
            )}`,
          );
        },
        error: (error: unknown) => {
          const duration = Date.now() - start;
          const errorMessage = (error as Error)?.message ?? 'unknown';
          const errorStack = (error as Error)?.stack;
          this.logger.error(
            `Error ${method} ${originalUrl} ${response.statusCode} | ${duration}ms | message=${errorMessage}`,
            errorStack,
          );
        },
      }),
    );
  }

  private sanitizePayload(payload: unknown): unknown {
    if (payload === null || payload === undefined) {
      return payload;
    }

    if (Array.isArray(payload)) {
      return payload.map((item) => this.sanitizePayload(item));
    }

    if (typeof payload === 'object' && payload !== null) {
      return Object.entries(payload).reduce<Record<string, unknown>>(
        (acc, [key, value]) => {
          if (typeof key === 'string' && this.isSensitiveKey(key)) {
            acc[key] = '***';
            return acc;
          }
          acc[key] = this.sanitizePayload(value);
          return acc;
        },
        {},
      );
    }

    return payload;
  }

  private isSensitiveKey(key: string): boolean {
    const normalized = key.toLowerCase();
    return ['password', 'code', 'token'].includes(normalized);
  }
}
