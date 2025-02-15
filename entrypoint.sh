#!/bin/bash

# Wait for MySQL to be healthy (optional, but good practice)
while ! mysqladmin ping -h mysql -u${MYSQL_USER} -p${MYSQL_PASSWORD} 2>/dev/null; do
  echo "Waiting for MySQL..."
  sleep 5
done

echo "MySQL is ready. Running migrations..."
npm run migrate # or npx prisma migrate dev

echo "Migrations complete. Starting NestJS..."
npm start dev