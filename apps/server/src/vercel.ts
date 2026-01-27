import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';

const server = express();

const createNestServer = async (expressInstance: express.Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  await app.init();
  return app;
};

let appPromise: Promise<any>;

export default async function handler(req: any, res: any) {
  if (!appPromise) {
    appPromise = createNestServer(server);
  }
  await appPromise;
  server(req, res);
}
