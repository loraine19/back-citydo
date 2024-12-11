import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('First API')
    .setDescription('users & groups ')
    .setVersion('2')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors(
    {
      origin:
        ['http://localhost:5173/',
          'http://51.210.106.127:8080/',
          'https://imagindev-app.fr/'

        ]
    }

  );

  await app.listen(3000);
}
bootstrap();