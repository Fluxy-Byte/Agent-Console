FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Vite grava VITE_* no bundle em TEMPO DE BUILD, não de execução. Default já
# aponta pra URL de produção real; passe --build-arg VITE_API_BASE_URL=... no
# EasyPanel só se precisar apontar pra outro ambiente.
ARG VITE_API_BASE_URL=https://agentes-api.fluxytechnologies.com.br
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 7072
CMD ["serve", "-s", "dist", "-l", "7072"]
