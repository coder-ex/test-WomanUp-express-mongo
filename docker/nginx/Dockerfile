FROM nginx

# Install tools required for build stage
RUN apt-get update && apt-get install -fyqq \
    nmap net-tools tcpdump sudo nano mc

ADD ./default.conf /etc/nginx/conf.d/default.conf

# Create usermod && groupmod
RUN usermod -u 1000 nginx \
    && groupmod -g 1000 nginx \
    && usermod -aG sudo,root,www-data,plugdev nginx

WORKDIR /home/node/www
