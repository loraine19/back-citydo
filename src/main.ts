import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { PrismaFilter } from '../middleware/filter/prisma.filter';
import { HttpExeptionFilter } from '../middleware/filter/http.filter';
import { ErrorFilter } from '../middleware/filter/error.filter';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggerService } from './logger/logger.service';
import * as cookieParser from 'cookie-parser'
import { IoAdapter } from '@nestjs/platform-socket.io';
//
async function bootstrap() {

  // --- AJOUT DEBUG ---
  console.log('--- DEBUG STARTUP ---');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('DATABASE_URL (Check limit):', process.env.DATABASE_URL ? process.env.DATABASE_URL.split('@')[1] : 'UNDEFINED');
  console.log('OpenSSL Version (Node):', process.versions.openssl);
  console.log('---------------------');
  // -------------------

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new LoggerService()
  });

  const config = new DocumentBuilder()
    .setTitle('City\'Do API ')
    .setDescription('Please first login to use the API {"email":"test@mail.com","password":"passwordtest"} to get the token and use the token in Authorize button')
    .setVersion('test')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apiSwagger', app, document);
  app.setGlobalPrefix('data');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new ErrorFilter(),
    new HttpExeptionFilter(),
    new PrismaFilter(httpAdapter),
  );

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    index: false,
    prefix: '/public',
  });
  app.setBaseViewsDir(join('../public'));
  const allowedOrigins = [
    process.env.FRONT_URL,
    'http://localhost:4173',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'prod') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS',
    allowedHeaders: 'Authorization,Content-Type, AcceptX-Requested-With', // Ajout de Origin, X-Requested-With
    credentials: true,
    preflightContinue: false
  })
  app.useWebSocketAdapter(new IoAdapter(app))
  await app.listen(parseInt(process.env.PORT) || 3000);
}
bootstrap();
