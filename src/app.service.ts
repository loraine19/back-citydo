import { Injectable } from '@nestjs/common';
import { Controller, Post, Body } from '@nestjs/common';


@Injectable()
export class AppService {
  getHello(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Index Page</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f0f0f0;
          }
          .container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1, h2, h4 {
            margin: 0 0 10px;
          }
          a {
            color: #007bff;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .flex {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container flex">
          <h1>Collectif Back</h1>
          <a href="/api">Swagger</a>
          <h2>Users and Groups</h2>
          <a href="/users">Users</a>
          <a href="/profiles">Profiles</a>
          <a href="/groups">Groups</a>
          <a href="/group-users">Group Users</a>
          <h2>Address, Events, Participants, Service</h2>
          <a href="/address">Address</a>
          <a href="/events">Events</a>
          <a href="/participants">Participants</a>
          <a href="/service">Service</a>
          <h2>Posts and Likes</h2>
          <a href="/posts">Posts</a>
          <a href="/likes">Likes</a>
          <h2>Tools</h2>
          <a href="https://pma.imagindev-app.fr/">PMA</a>
          <a href="https://prisma.imagindev-app.fr/">Prisma</a>
        </div>
      </body>
      </html>
    `;
  }
}
