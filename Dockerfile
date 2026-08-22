FROM node:24-alpine

WORKDIR /replication

RUN apk add --no-cache \
    bash \
    curl \
    wget \
    git \
    nano \
    vim \
    build-base \
    cmake \
    python3 \
    py3-pip \
    linux-headers \
    openssl-dev \
    pkgconfig

RUN addgroup -S replication && \
    adduser -S replication -G replication

# Make the container filesystem writable by replication
RUN chown -R replication:replication /usr /etc /lib /var

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

RUN mkdir -p /replication/workspaces && \
    chown -R replication:replication /replication

ENV NODE_ENV=production
ENV WORKSPACE_ROOT=/replication/workspaces
ENV USER=ReplicationUser

USER replication

EXPOSE 3000

CMD ["npm", "start"]
