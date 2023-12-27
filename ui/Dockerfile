FROM node:current-bookworm

# Update Ubuntu packages
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get clean

# normal stuff
RUN apt-get install -y vim aptitude python3-pip magic-wormhole file tmux ts-node

RUN mkdir /application
COPY . /application/ui
WORKDIR /application/ui
RUN npm install

RUN npx prisma generate

ENTRYPOINT ["npx", "next", "dev"]
