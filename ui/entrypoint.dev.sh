#!/bin/sh
set -e

until pg_isready -h postgres -U blockout; do
  echo "Waiting for postgres..."
  sleep 1
done

npx prisma db push --accept-data-loss
node prisma/seed.js

exec npx next dev
