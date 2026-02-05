FROM node:20-alpine

WORKDIR /app

# 1. Copia o package.json e instala dependências
COPY package.json package-lock.json ./
RUN npm install

# 2. Copia o resto do código
COPY . .

# 3. Expõe a porta do Vite
EXPOSE 5173

# 4. Roda o servidor de desenvolvimento (host 0.0.0.0 é essencial no Docker)
CMD ["npm", "run", "dev", "--", "--host"]