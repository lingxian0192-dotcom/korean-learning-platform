import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Matches the global prefix in main.ts
  app.setGlobalPrefix('api/v1');
  
  // Enable CORS with specific options matching main.ts
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Add logging middleware
  app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.url} from ${req.headers.origin}`);
    next();
  });

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (event: Context, context: Callback, callback: Callback) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
