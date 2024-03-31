FROM ghcr.io/puppeteer/puppeteer:22.6.1
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

    WORKDIR /usr/src/app

    COPY pagacke*.json ./
    RUN npm PUPPETEER_SKIP_CHROMIUM_DOWNLOADCOPY . .
    CMD [ "node", "index.js"]