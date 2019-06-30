FROM node:10

RUN apt-get update && apt-get install -y netcat

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

ENV DATABASE_URL="postgres://postgres:postgres@localhost:5432/discord_wow_request"
ENV PGUSER=postgres
ENV PGHOST=localhost
ENV PGPASSWORD=postgres
ENV PGDATABASE=discord_wow_request

ENV DISCORDBOTTOKEN="discord bot token"
ENV BOTCHANNEL="bot channel"


CMD [ "npm", "start" ]