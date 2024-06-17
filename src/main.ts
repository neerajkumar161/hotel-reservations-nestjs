import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GqlExceptionFilter } from './common/filters/gql-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GqlExceptionFilter());
  app.enableCors({
    origin: '*', // Allow all origins, Not recommended for production
    methods: 'POST',
  })
  await app.listen(3000);
}
bootstrap();
