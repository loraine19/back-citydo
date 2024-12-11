import { INestApplication, Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OpenAPIObject } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';



@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule],
})
export class UsersModule {
  static setup(arg0: string, app: INestApplication<any>, document: OpenAPIObject) {
    throw new Error('Method not implemented.');
  }
  static createDocument(app: INestApplication<any>, config: Omit<OpenAPIObject, "paths">) {
    throw new Error('Method not implemented.');
  }
}
