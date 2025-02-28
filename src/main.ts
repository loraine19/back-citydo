import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { PrismaFilter } from '../middleware/filter/prisma.filter';
import { HttpExeptionFilter } from '../middleware/filter/http.filter';
import { ErrorFilter } from '../middleware/filter/error.filter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggerService } from './logger/logger.service';
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new LoggerService(),
  });
  const config = new DocumentBuilder()
    .setTitle('Collectif API ')
    .setDescription('Please first login to use the API {"email":"test@mail.com","password":"passwordtest"} to get the token and use the token in Authorize button')
    .setVersion('test')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

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
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Authorization,Content-Type, Accept',
    credentials: true,
  })

  await app.listen(process.env.PORT);
}
bootstrap();
