FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm ci

COPY . /app/
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package.json /app/package-lock.json /app/
RUN npm ci --omit=dev

COPY --from=build /app/.next /app/.next
COPY --from=build /app/public /app/public
COPY --from=build /app/pages /app/pages
COPY --from=build /app/app /app/app
COPY --from=build /app/lib /app/lib
COPY --from=build /app/next.config.mjs /app/next.config.mjs
COPY --from=build /app/jsconfig.json /app/jsconfig.json
COPY --from=build /app/postcss.config.mjs /app/postcss.config.mjs

EXPOSE 3000
CMD ["npm","run","start","--","-p","3000"]


