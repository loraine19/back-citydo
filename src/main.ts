import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { PrismaFilter } from '../utils/filter/prisma.filter';
import { HttpExeptionFilter } from '../utils/filter/http.filter';
import { ErrorFilter } from '../utils/filter/error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('Collectif API ')
    .setDescription('first api nest ')
    .setVersion('1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new ErrorFilter(),
    new HttpExeptionFilter(),
    new PrismaFilter(httpAdapter)
  );
  app.enableCors(
    {
      origin:
        ['http://localhost:5173',
          'http://51.210.106.127:8080',
          'https://imagindev-app.fr',
          'http://5.51.122.204',
          'https://5.51.122.204'
        ]
    }
  );


  await app.listen(3000);
}
bootstrap();