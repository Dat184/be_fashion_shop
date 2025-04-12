import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';
import { TransformInterceptor } from './core/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // config to use .env file
  const configService = app.get(ConfigService);

  const reflector = app.get(Reflector);

  // user Interceptor to transform the response
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  // config versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });

  //port to connect to the server
  await app.listen(configService.get<string>('PORT') ?? '8000');
}
bootstrap();
