FROM node:24-alpine

WORKDIR /replication

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN addgroup -S replication && \
adduser -S replication -G replication

RUN mkdir -p /replication/workspaces && \
chown -R replication:replication /replication

ENV NODE_ENV=production
ENV WORKSPACE_ROOT=/replication/workspaces
ENV USER=ReplicationUser

USER replication

EXPOSE 3000

CMD ["npm", "start"]
