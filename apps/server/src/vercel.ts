import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';

const server = express();

const createNestServer = async (expressInstance: express.Express) => {
  try {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressInstance),
    );
    app.setGlobalPrefix('api/v1');
    app.enableCors();
    await app.init();
    return app;
  } catch (err) {
    console.error('NestJS Init Error:', err);
    throw err;
  }
};

let appPromise: Promise<any>;

export default async function handler(req: any, res: any) {
  try {
    if (!appPromise) {
      appPromise = createNestServer(server);
    }
    await appPromise;
    server(req, res);
  } catch (err) {
    console.error('Handler Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
}
