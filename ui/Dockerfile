FROM node:current-bookworm

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get clean

RUN apt-get install -y vim aptitude python3-pip magic-wormhole file tmux ts-node postgresql-client

RUN mkdir /application
COPY . /application/ui
WORKDIR /application/ui
RUN npm install

RUN npx prisma generate
RUN SKIP_ENV_VALIDATION=1 npm run build

ENTRYPOINT ["/bin/sh", "/application/ui/entrypoint.sh"]
