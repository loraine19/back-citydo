import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
      <div class="container flex flex-col gap-4 px-8">
        <h1>collectif back</h1>
        <a href="/api">Swagger</a><br>

        <H2>Users and Groups</H2>
        <a href="/users">Users</a><br>
        <a href="/profiles">Profiles</a><br>
        <a href="/groups">Groups</a><br>
        <a href="/group-users">GroupUsers</a><br>

        <h4>Address, Events, Participants, Service</h4>
        <a href="/address">Address</a><br>
        <a href="/events">Events</a><br>
        <a href="/participants">Participants</a><br>
        <a href="/service">Service</a><br>

        <h4>Posts and Likes</h4>
        <a href="/posts">Posts</a><br>
        <a href="/likes">Likes</a><br>
        
        <h4>tools</h4>
        <a href="https://pma.imagindev-app.fr/">PMA</a><br>
        <a href="https://prisma.imagindev-app.fr/">Prisma</a>
      </div>
    `;
  }
}
