# Usa uma imagem base do Node.js com npm
FROM node:16-alpine

# Define o diretório de trabalho no container
WORKDIR /app

# Copia o package.json e o package-lock.json para o container
COPY package*.json ./

# Instala as dependências com --legacy-peer-deps para evitar conflitos
RUN npm install --legacy-peer-deps

# Copia o restante do código-fonte para o container
COPY . .

# Constrói a aplicação React
RUN npm run build

# Expõe a porta 3000
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]