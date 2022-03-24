docker rm -f nginx-dev
docker run --name nginx-dev --network host --rm -d -v $(pwd)/default.conf:/etc/nginx/conf.d/default.conf nginx