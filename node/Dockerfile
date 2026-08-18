# Stage 1: Build


FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npx tsc


# Stage 2: Prodution 
FROM node:20-alpine as production

WORKDIR /app
ENV NODE_ENV=production


COPY package*.json ./
RUN npm ci --omit=dev   


COPY --from=build /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/index.js"]