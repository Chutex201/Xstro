FROM node:20
WORKDIR /app
RUN apt-get update && \
    apt-get install -y git && \
    npm install -g pm2 && \
    git config --global url."https://".insteadOf git:// && \
    git config --global url."https://github.com/".insteadOf git@github.com:
RUN git clone https://github.com/AstroX11/Xstro.git .
RUN yarn install --network-timeout 1000000
EXPOSE 8000
CMD ["pm2-runtime", "start", "npm", "--", "start"]
