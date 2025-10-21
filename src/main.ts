import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express'; // ✅ FIXED IMPORT

const server = express(); // ✅ now callable

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors();

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('EduHire API')
    .setDescription('API documentation for the EduHire e-learning platform')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Provide the JWT access token',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.init(); // ✅ do NOT use app.listen()
}

bootstrap();

export default server; // ✅ export Express server for Vercel
