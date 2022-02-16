
# STAGE 1
FROM node:bullseye-slim as builder
RUN mkdir -p /home/app/node_modules && chown -R node:node /home/app
WORKDIR /home/app
COPY package*.json ./
RUN npm config set unsafe-perm true
RUN npm install -g typescript
RUN npm install -g ts-node
USER node
RUN npm install
COPY --chown=node:node . .
RUN npm run build

# STAGE 2
FROM node:bullseye-slim
RUN mkdir -p /home/app/node_modules && chown -R node:node /home/app
WORKDIR /home/app
COPY package*.json ./
USER node

RUN npm install --production
COPY --from=builder /home/app/dist ./dist

COPY --chown=node:node .env .

EXPOSE 8000
CMD [ "node", "dist/app.js" ]