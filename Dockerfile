
FROM node:slim AS build

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma ./  

# order? 
RUN apt-get update -y && apt-get install -y openssl

RUN npm install 

COPY . .

RUN npx prisma generate 

RUN npm run build

FROM node:slim

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma ./  

COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/dist ./dist

COPY --from=build /app/middleware ./middleware

COPY --from=build /app/prisma ./prisma 

RUN npm prune 

EXPOSE 3000

CMD ["node", "dist/src/main.js"] 