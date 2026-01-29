import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Set global prefix
  app.setGlobalPrefix('api/v1');

  // Enable CORS for frontend
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Add simple logging middleware
  app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.url} from ${req.headers.origin}`);
    next();
  });

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
