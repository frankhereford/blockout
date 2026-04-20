#!/bin/sh
set -e

DOMAIN="blockout.frankhereford.com"
EMAIL="frank.hereford@austintexas.gov"

certbot certonly \
  --dns-route53 \
  --non-interactive \
  --agree-tos \
  --email "$EMAIL" \
  --domain "$DOMAIN" \
  --keep-until-expiring

cat "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" \
    "/etc/letsencrypt/live/$DOMAIN/privkey.pem" \
    > /haproxy-certs/haproxy.pem

echo "Certificate written to /haproxy-certs/haproxy.pem"
