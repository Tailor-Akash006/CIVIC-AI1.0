import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('CIVICMIND-Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global API prefix: /api
  const globalPrefix = process.env.API_PREFIX || 'api';
  app.setGlobalPrefix(globalPrefix);

  // Enable CORS for frontend integration
  const allowedOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',').map(s => s.trim())
    : ['http://localhost:5173', 'http://localhost:3000'];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman) or matched origins
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in development
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger API Documentation setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('CIVICMIND REST API')
    .setDescription(
      'AI-Powered Civic Complaint Management & Municipal Intelligence Platform. Connects citizen reporting to automated Gemini AI triage, duplicate clustering, priority scoring, and municipal dispatch workflows.',
    )
    .setVersion('1.0.0')
    .addTag('Complaints', 'Citizen complaint submission, tracking, and management')
    .addTag('Dashboard Analytics', 'Real database municipal KPIs, priority distribution, and GIS hotspots')
    .addTag('Authentication', 'JWT citizen and authority authentication')
    .addTag('Authorities', 'Municipal departments and dispatched field officers')
    .addTag('Uploads', 'Photographic evidence file uploads (Multer)')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document, {
    customSiteTitle: 'CIVICMIND API Documentation',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  logger.log(`========================================================`);
  logger.log(`CIVICMIND NestJS Backend running at http://localhost:${port}/${globalPrefix}`);
  logger.log(`Swagger Interactive API Docs at http://localhost:${port}/${globalPrefix}/docs`);
  logger.log(`========================================================`);
}

bootstrap();
