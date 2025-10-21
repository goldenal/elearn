import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors();

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

  await app.init();

  // Listen only in non-serverless environments
  if (process.env.NODE_ENV !== 'production') {
    await app.listen(process.env.PORT || 3000, '0.0.0.0');
  }

  return app;
}

bootstrap();

export default server;