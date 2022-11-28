FROM node:18

# Install tools required for build stage
RUN apt-get update && apt-get install -fyqq \
    mc bash curl wget rsync ca-certificates openssl ssh \
    npm nmap net-tools tcpdump sudo nano

# Create usermod && groupmod
RUN usermod -u 1000 node \
    && groupmod -g 1000 node \
    && usermod -aG sudo,root,www-data,plugdev node

RUN echo "root:r12345" | chpasswd \
    && echo "node:u12345" | chpasswd

# Copy existing application directory permissions
RUN chown node:node /home/node
COPY --chown=node:node . /home/node/www

# устанавливаем рабочий каталог
WORKDIR /home/node

# установим активного пользователя
USER node

EXPOSE 8000