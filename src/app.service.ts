import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {


  getHello(): any{
    return '<div class="container flex flex-col gap-4"><h1>First API</h1><a href="/api">Swagger</a><br><a href="/users">Users</a><br><a href="/groups">Groups</a><br><a href="http://localhost:8099">PMA</a><br> <a href="http://localhost:5558">Prisma</a><div>';
  }
}