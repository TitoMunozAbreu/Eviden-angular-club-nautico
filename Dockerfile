FROM node:16.16.0 as build-step
RUN mkdir -p /usr/local/app
WORKDIR /usr/local/app
COPY ./ /usr/local/app/
RUN npm install
RUN npm run build --prod


FROM nginx:1.23.1
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-step /usr/local/app/dist/club-nautico /usr/share/nginx/html

EXPOSE 80

# Crear la imagen del proyecto abrir en gitBash
# docker build -t frontend:1.0 .

# comprobar que se ha creado
# docker image list