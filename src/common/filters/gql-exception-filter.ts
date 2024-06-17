import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';

@Catch()
export class GqlExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const ctx = gqlHost.getContext();

    if (exception instanceof HttpException) {
      // Handle Invalid path because of the way Error is thrown in NestJS for GraphQL, Kind of workaround
      if(exception.message.includes('Cannot GET /')) {
        return host.switchToHttp().getResponse().send({ message: 'Path not found', code: 404 });
      }

      const status = exception.getStatus();
      const message = exception.message || null;
      throw new ApolloError(message, status.toString());
    } else {
      const status = HttpStatus.INTERNAL_SERVER_ERROR;
      const message = (exception as any).message || 'Internal server error';

      throw new ApolloError(message, status.toString());
    }
  }
}
