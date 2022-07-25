#!/usr/bin/env bash

cd /app

echo "Atualizando pacotes necessários do container"

sudo chrmod -R 777 /api/tokens

apt-get update && apt-get install -y netcat 

echo "Verificando dependências do Yarn"

yarn

echo "Iniciando o serviço"
# ENVIRONMENT=$(cat .env | grep ENVIRONMENT | cut -d "=" -f 2)
MONGODB_URI=mongodb+srv://app_admin:l4vnDIfZCw2SIvBM@cluster0.n3j8j.mongodb.net/agendar_me?retryWrites=true&w=majority

yarn start
