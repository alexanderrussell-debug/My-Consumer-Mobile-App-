# Runs the app in a browser with the mock backend. Not used for the store builds.
FROM node:8-alpine
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY www ./www
COPY mock-api ./mock-api
EXPOSE 8100
CMD ["node", "mock-api/server.js"]
