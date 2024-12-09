import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {


  getHello(): any{
    return '<a href="/api"> Swagger</a><br><a href="/users"> Users</a><br><a href="/groups"> -  Groups</a>';
  }
}