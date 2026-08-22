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

# Create users
RUN addgroup -S replication && \
    adduser -S replication -G replication && \
    addgroup -S apk && \
    adduser -S apk -G apk

# Give apk user ownership of package manager and install locations
RUN chown -R apk:apk \
    /sbin/apk \
    /etc/apk \
    /var/lib/apk \
    /var/cache/apk \
    /usr \
    /lib \
    /bin

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
