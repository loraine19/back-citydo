# Collectif

Collectif is a NestJS API for managing a collaborative project.

## Installation dev mode

1. Clone the repository:
   git clone https://github.com/loraine19/collectif.git
   cd collectif

2. Install dependencies:
   npm install

3. Set up the database:

- Open phpMyAdmin and create a new MySQL database.
- Create a new user and grant them access to the database:
  1. Go to the "User accounts" tab.
  2. Click "Add user account".
  3. Fill in the "User name" and "Password" fields.
  4. Under "Database for user", select "Create database with same name and grant all privileges".
  5. Click "Go".

4. Configure the database connection:

- Create a `.env` file in the root directory
- Example : .env.example

5. Run the Prisma migrations:
   npx prisma migrate dev
   if the seed don't run you can run it manually
   npm run prisma-seed

6. Start the dev watching mode of application:
   npm run start:dev

## Usage

- Access the API at `http://localhost:3000`.

## Deployment using gitHub

To deploy the application using Docker Compose, follow these steps:

1. Ensure Docker are installed on your vps server.

2. Clone the repository:

```sh
git clone https://github.com/loraine19/collectif.git
cd collectif
```

3. Create and configure the `.env` file in the root directory as described in the Installation section.

4. Start the application using Docker Compose:

```sh
docker network create back
docker-compose up -d
```

5. Open phpMyAdmin and grant access to the database as in development mode:

- Open phpMyAdmin at `http://dockercontainername or serverIp:docker port ( you must give port first in docker compose )`.
- Create a new MySQL database.
- Create a new user and grant them access to the database:
  1. Go to the "User accounts" tab.
  2. Click "Add user account".
  3. Fill in the "User name" and "Password" fields.
  4. Under "Database for user", select "Create database with same name and grant all privileges".
  5. Click "Go".

6. Run the Prisma migrations:

```sh
docker-compose exec app npx prisma migrate dev
```

7. If the seed doesn't run automatically, you can run it manually:

```sh
docker-compose exec app npm run prisma-seed
```

8. Access the API at `http://dockercontainername/api or serverIp:dockerport/api ( you must give port first in docker compose )`.

## Deployment using Docker Hub

To deploy the application using Docker Hub, follow these steps:

1. Ensure Docker is installed on your VPS server.

2. Pull the Docker image from Docker Hub:

```sh
docker pull lorainep/back-collectif:latest
```

3. Create and configure the `.env` file in the root directory as described in the Installation section.

4. Create the docker-compose.yml
   you can copy it from the repo

5. Start the application using Docker Compose:

```sh
docker network create back
docker-compose up -d
```

6. Open phpMyAdmin and grant access to the database as in development mode:

- Open phpMyAdmin at `http://dockercontainername or serverIp:docker port (you must give port first in docker compose)`.
- Create a new MySQL database.
- Create a new user and grant them access to the database:
  1. Go to the "User accounts" tab.
  2. Click "Add user account".
  3. Fill in the "User name" and "Password" fields.
  4. Under "Database for user", select "Create database with same name and grant all privileges".
  5. Click "Go".

7. Run the Prisma migrations:

```sh
docker-compose exec app npx prisma migrate dev
```

8. If the seed doesn't run automatically, you can run it manually:

```sh
docker-compose exec app npm run prisma-seed
```

9. Access the API at `http://dockercontainername/api or serverIp:dockerport/api (you must give port first in docker compose)`.

## License

This project is licensed under personal License.
