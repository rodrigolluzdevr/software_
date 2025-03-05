FROM node:18-alpine  
WORKDIR /app  
RUN npm install -g @nestjs/cli
COPY package*.json ./  
RUN npm install  
COPY . .  
RUN npm run build  
CMD ["npm", "run", "start:dev"] 
EXPOSE 4000  