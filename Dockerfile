FROM node

WORKDIR /usr/src/app
ADD . /usr/src/app

RUN npm install

ENV NODE_ENV production
ENV SERVER_PORT 4040
ENV JWT_SECRET 0a6b944d-d2fb-46fc-a85e-0295c986cd9f
ENV MONGO_HOST mongo_db_url_here
ENV MEAN_FRONTEND angular

EXPOSE 4040

CMD ["node", "index.js"]
