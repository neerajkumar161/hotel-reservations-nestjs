import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Allow all origins, Not recommended for production
    methods: 'POST',
  })
  await app.listen(3000);
}
bootstrap();
