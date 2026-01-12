# Estágio 1: Build da aplicação React
FROM node:20-alpine AS build

WORKDIR /app

# Copia as dependências primeiro para aproveitar o cache do Docker
COPY package*.json ./
RUN npm ci

# Copia o código fonte e gera o build
COPY . .
RUN npm run build

# Estágio 2: Servidor Nginx para rodar o frontend
FROM nginx:alpine

# Copia os arquivos gerados no estágio anterior para a pasta do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# (Opcional) Configuração customizada do Nginx se precisar lidar com rotas do React Router
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]