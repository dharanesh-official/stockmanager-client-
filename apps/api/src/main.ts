import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // SECURITY: Vulnerability Protection
  // Helmet sets strict security headers:
  // - Content-Security-Policy (XSS protection)
  // - X-Frame-Options (Clickjacking protection)
  // - Strict-Transport-Security (Force HTTPS)
  app.use(helmet());

  // SECURITY: Input Validation
  // deeply validates all incoming JSON bodies.
  // If a user sends a field that isn't defined in the DTO, it is stripped or rejected.
  // This prevents Mass Assignment Vulnerabilities.
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            // Remove unknown properties
    forbidNonWhitelisted: true, // Throw error on unknown properties
    transform: true,            // Auto-convert types (String "1" -> Number 1)
  }));

  // SECURITY: CORS (Cross-Origin Resource Sharing)
  // In production, this must be restricted to the exact Web Domain.
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3001, '0.0.0.0');
  console.log(`Server is running on: ${await app.getUrl()}`);
}
bootstrap();
