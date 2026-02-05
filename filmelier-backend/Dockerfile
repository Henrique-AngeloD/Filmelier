FROM php:8.2-cli

# 1. Instala dependências do sistema e do PHP (Postgres)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql

# 2. Instala o Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 3. Define a pasta de trabalho
WORKDIR /var/www

# 4. Copia os arquivos do projeto
COPY . .

# 4.1 Cria diretórios exigidos pelo Laravel
RUN mkdir -p bootstrap/cache storage \
    && chmod -R 775 bootstrap/cache storage

# 5. Instala as dependências do Laravel
RUN composer install

# 6. Expõe a porta 8000 e roda o servidor
EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]