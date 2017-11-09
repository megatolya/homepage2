FROM node:6.11.3

ARG version

ADD package.json /var/www/package.json
ADD .npmrc /var/www/.npmrc

RUN sleep 1 \
    && cd /var/www \
    && npm install --silent

WORKDIR /var/www/

ADD webpack /var/www/webpack
ADD app /var/www/app
ADD .babelrc /var/www/.babelrc

RUN npm run build && npm version $version -f

ARG app_key

ENV APP_SECRET $app_key
ENV NODE_ENV "production"

EXPOSE 80

CMD node --max-old-space-size=900 app/server.js
