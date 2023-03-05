import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Moralis from 'moralis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });
  await app.listen(8080);
}
bootstrap();
