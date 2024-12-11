import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {


  getHello(): any {
    return '<div class="container flex flex-col gap-4 px-8"><h1>First API</h1><a href="/api">Swagger</a><br><a href="/users">Users</a><br><a href="/groups">Groups</a><br><a href="/events">Events</a><br><a href="/address">Address</a><br><a href="/events">Events</a><br><a href="/parrticipants">Participants</a><br><a href="https://pma.imagindev-app.fr/">PMA</a><br> <a href="https://primsa.imagindev-app.fr/">Prisma</a><div>';
  }
}