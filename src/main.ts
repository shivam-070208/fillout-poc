import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  // Fillout sends webhook as text/plain;charset=UTF-8 with JSON string, so parse all text/* and json
  app.use(express.json({ type: ['application/json', 'text/plain'] }));
  app.use(express.text({ type: 'text/plain' }));
  app.use(express.urlencoded({ extended: true }));
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await app.listen(port);
  console.log(`App listening on ${process.env.APP_BASE_URL || `http://localhost:${port}`}`);
  console.log(`Fillout base: ${process.env.FILLOUT_BASE_URL}`);
  console.log(`Webhook URL: ${process.env.APP_BASE_URL}/webhooks/{formId}`);
}
bootstrap();
