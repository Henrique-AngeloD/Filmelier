# **CSI606-2025-02 - Proposta de Trabalho Final**

## *Discente: Henrique Ângelo Duarte Alves*

<!-- Descrever um resumo sobre o trabalho. -->

### Resumo

  Este trabalho propõe o desenvolvimento de um sistema web, "Filmelier", uma aplicação web full-stack projetada para solucionar a indecisão comum ao escolher filmes. O sistema contará com autenticação de usuários, permitindo que cada pessoa tenha sua própria "Biblioteca" de filmes assistidos, com espaço para comentários pessoais. A funcionalidade principal permitirá ao usuário selecionar até três filmes que gosta; com base nesses títulos, o backend analisará seus dados e consultará o banco de dados para sugerir filmes semelhantes. A lógica de recomendação será personalizada, excluindo automaticamente os filmes que o usuário já marcou como assistido em sua biblioteca. O projeto empregará um frontend moderno em React, um backend robusto em PHP com o framework Laravel, e um banco de dados PostgreSQL.

<!-- Apresentar o tema. -->
### 1. Tema

O trabalho final tem como tema o desenvolvimento de uma aplicação web de recomendação de filmes personalizada, incluindo autenticação de usuários, frontend desacoplado (React), backend como API (Laravel) e um banco de dados relacional (PostgreSQL). O foco é aplicar os conceitos de arquitetura de sistemas web, criação e consumo de APIs (incluindo rotas autenticadas) e lógica de negócios no backend.

<!-- Descrever e limitar o escopo da aplicação. -->
### 2. Escopo

Este projeto terá as seguintes funcionalidades:
1. Frontend (React):

    * Páginas de Cadastro (Registro) e Login de usuários.

    * Gerenciamento de estado de autenticação (exibindo nome do usuário, botões de Login/Logout, etc.).

    * Uma página de "Biblioteca" pessoal, onde o usuário pode ver os filmes que já assistiu, adicionar e editar comentários.

    * Uma interface principal onde o usuário pode buscar filmes (para adicionar à biblioteca ou para usar como base de recomendação).

    * Exibição dos resultados da busca.

    * Uma área para exibir os 3 filmes selecionados pelo usuário para recomendação.

    * Um botão para "Gerar Recomendações".

    * Uma página ou seção para exibir a lista de filmes recomendados (já filtrada).
2. Backend:
    * Endpoints de autenticação (Registro, Login, Logout).

    * Rotas de API protegidas que só podem ser acessadas por usuários autenticados.

    * Um endpoint GET /api/search que atua como proxy, buscando filmes na API externa do TMDb.

    * Endpoints CRUD (Create, Read, Update, Delete) para a biblioteca do usuário (ex: GET /api/library, POST /api/library/add, PUT /api/library/{movieId}).

    * Um endpoint (protegido) que recebe os IDs dos 3 filmes selecionados.

    * Lógica interna para analisar os 3 filmes e criar um "perfil de gosto".

    * Lógica de consulta ao banco de dados (PostgreSQL) para encontrar filmes que correspondam ao perfil, cruzando com a biblioteca do usuário para excluir filmes já assistidos.

    * Retorno da lista de filmes recomendados em formato JSON.
3. Banco de Dados:
    * Tabela users para autenticação.

    * Tabela movies.

    * Tabela user_movie_library para ligar usuários a filmes, contendo campos como comment e status.

    * O banco de dados de movies será pré-populado (via seeding) com um conjunto de dados do TMDb.


<!-- Apresentar restrições de funcionalidades e de escopo. -->
### 3. Restrições

Neste trabalho não serão considerados:

* Funcionalidades de streaming de vídeo.

* Recomendações de séries de TV; o escopo é restrito a filmes.

* Funcionalidades sociais complexas (ex: seguir outros usuários, ver a biblioteca de amigos).

<!-- Construir alguns protótipos para a aplicação, disponibilizá-los no Github e descrever o que foi considerado. //-->
### 4. Protótipo

Os protótipos de interface estão sendo desenvolvidos na ferramenta Figma:

https://www.figma.com/design/owulvsUFRJuotMdcxMWlu4/Fimelier?node-id=1-2&t=LwKat6nNmY7Wulrw-1

### 5. Referências

THE MOVIE DATABASE (TMDb). **API Documentation**. Disponível em: https://developer.themoviedb.org/docs. Acesso em: 15 nov. 2025.

LARAVEL. **Documentation**. Disponível em: https://laravel.com/docs/11.x. Acesso em: 15 nov. 2025.

REACT. **Documentation**. Disponível em: https://react.dev/learn. Acesso em: 15 nov. 2025.


## Como rodar o projeto:

- Entre na pasta do backend: `cd filmelier-backend`
- Copie o arquivo `.env.example` e renomeie para `.env`
- Abra o arquivo `.env` e adicione sua chave da API do tmdb aqui
- Na pasta raiz rode o comando `docker compose up --build -d` (somente na primeira vez, depois rode apenas `docker compose up -d`)
- Configurar o backend:
    * Instalar dependências do PHP: `docker compose exec backend composer install`
    * Gerar a chave de criptografia do Laravel: `docker compose exec backend php artisan key:generate`
    * Configurar as Rotas da API: `docker compose exec backend php artisan install:api` selecione "yes"
    * Criar o Banco de Dados e Popular com Filmes: `docker compose exec backend php artisan migrate:fresh --seed`
