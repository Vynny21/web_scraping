FROM node:alpine

WORKDIR /dev/app/app_scraping

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm" "start" ]