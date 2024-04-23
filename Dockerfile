FROM node:18

WORKDIR /usr/src/app

# Install dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn

# Copy source
COPY . .

RUN yarn build

CMD ["yarn", "start"]