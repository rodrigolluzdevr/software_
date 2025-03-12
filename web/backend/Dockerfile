FROM node:18-alpine  

WORKDIR /app  

COPY prisma ./

RUN npm install -g @nestjs/cli

COPY package*.json ./  

RUN npm install  # Instalar as dependências, incluindo bcryptjs

RUN npm install bcryptjs  

COPY . .  

RUN npx prisma generate 

RUN npm run build

CMD ["npm", "run", "start:dev"]

EXPOSE 4000
