import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // config to use .env file
  const configService = app.get(ConfigService);


  //port to connect to the server
  await app.listen(configService.get<string>('PORT') ?? '8000');
}
bootstrap();
