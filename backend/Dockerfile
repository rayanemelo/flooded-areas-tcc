FROM node:18

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma

RUN yarn install

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

EXPOSE 3331

CMD ["yarn", "dev"]
