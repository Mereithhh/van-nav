FROM ubuntu:20.04
WORKDIR /app
COPY ./nav /app/nav
# VOLUME [ "/data" ]
EXPOSE 8233
ENTRYPOINT [ "/app/nav" ]