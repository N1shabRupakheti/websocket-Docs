
# Development Stage
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
CMD ["npm", "run", "dev"]

# Build Stage
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npx tsc


# Prodution Stage
FROM node:20-alpine as production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev   
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD ["node", "dist/index.js"]

