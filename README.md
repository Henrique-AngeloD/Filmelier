# **CSI606-2025-02 - Trabalho Final - Resultados**

## *Discente: Henrique Ângelo Duarte Alves*

<!-- Este documento tem como objetivo apresentar o projeto desenvolvido, considerando o que foi definido na proposta e o produto final. -->

### Resumo

  Este trabalho propõe o desenvolvimento de um sistema web, "Filmelier", uma aplicação web full-stack projetada para solucionar a indecisão comum ao escolher filmes. O sistema contará com autenticação de usuários, permitindo que cada pessoa tenha sua própria "Biblioteca" de filmes assistidos, com espaço para comentários pessoais. A funcionalidade principal permitirá ao usuário selecionar até três filmes que gosta; com base nesses títulos, o backend analisará seus dados e consultará o banco de dados para sugerir filmes semelhantes. A lógica de recomendação será personalizada, excluindo automaticamente os filmes que o usuário já marcou como assistido em sua biblioteca. O projeto empregará um frontend moderno em React, um backend robusto em PHP com o framework Laravel, e um banco de dados PostgreSQL.


### 1. Funcionalidades implementadas
<!-- Descrever as funcionalidades que eram previstas e foram implementas. -->
1. Frontend (React):

    * Páginas de Cadastro (Registro) e Login de usuários.

    * Gerenciamento de estado de autenticação (exibindo nome do usuário, botões de Login/Logout, etc.).

    * Uma página de "Biblioteca" pessoal, onde o usuário pode ver os filmes que já assistiu, adicionar e editar comentários.

    * Uma interface principal onde o usuário pode buscar filmes  usar como base de recomendação.

    * Exibição dos resultados da busca.

    * Uma área para exibir os 3 filmes selecionados pelo usuário para recomendação.

    * Uma página ou seção para exibir a lista de filmes recomendados (já filtrada).
2. Backend:
    * Sistema de Registro, Login e Logout utilizando Laravel Sanctum e gerenciamento de estado no React.

    * Rotas de API protegidas que só podem ser acessadas por usuários autenticados.

    * Endpoints CRUD (Create, Read, Update, Delete) para a biblioteca do usuário (ex: GET /api/library, POST /api/library/add, PUT /api/library/{movieId}).

    * Busca Otimizada: Pesquisa de filmes com suporte a busca textual aproximada (Trigram) no banco de dados local.

    * Lógica interna para analisar os 3 filmes e criar um "perfil de gosto".

    * Retorno da lista de filmes recomendados em formato JSON.
3. Banco de Dados:
    * Tabela users para autenticação.

    * Tabela movies.

    * Tabela user_movie_library para ligar usuários a filmes, contendo campos como comment e status.

    * O banco de dados de movies foi pré-populado (via seeding) com um conjunto de dados do TMDb.


### 2. Funcionalidades previstas e não implementadas
<!-- Descrever as funcionalidades que eram previstas e não foram implementas, apresentando uma breve justificativa do porquê elas não foram incluídas -->

Todas as funcionalidades planejadas no escopo inicial foram entregues e otimizadas durante o desenvolvimento.


### 3. Outras funcionalidades implementadas
<!-- Descrever as funcionalidades implementas além daquelas que foram previstas, caso se aplique.  -->

* Sistema Global de Notificações: Implementação de um ToastContext que permite disparar alertas não intrusivos de qualquer parte da aplicação.

* Performance de Banco de Dados: Criação de índices GIN e extensão pg_trgm no PostgreSQL para garantir buscas instantâneas mesmo em grandes volumes de dados.

### 4. Principais desafios e dificuldades
<!-- Descrever os principais desafios encontrados no desenvolvimento do trabalho, quais foram as dificuldades e como elas foram superadas e resolvidas. -->

* Performance em Ambiente Windows: A latência de usar o Docker no Windows causava lentidão, o desafio foi superado com a migração total do projeto para o ambiente WSL2 (Linux).

* Arquitetura de Dados: Inicialmente para testes eu fazia a pesquisa de filmes direto na API do TMDB, isso funcionou enquanto estava na fase de teste, quando populei meu banco de dados com mais filmes tive dificulade em trocar a lógica da busca inicial e fazer tudo funcionar utilizando uma coluna JSONB, visando maior performance e simplicidade no consumo da API.

* Configuração de Ambiente Docker: Tive um pequeno imprevisto ao tentar rodar o projeto do zero, o container do backend ficava subindo e caindo logo em seguido, isso foi resolvido ajustando o fluxo de instalação para garantir que o composer install ocorra antes do startup dos containers.

### 5. Instruções para instalação e execução
<!-- Descrever o que deve ser feito para instalar (ou baixar) a aplicação, o que precisa ser configurando (parâmetros, banco de dados e afins) e como executá-la. -->

- Clone o repositório `git clone https://github.com/henriqueangelo/filmelier.git`
- Entre na pasta do backend: `cd filmelier-backend`
- Copie o arquivo `.env.example` e renomeie para `.env`
- Abra o arquivo `.env` e adicione sua chave da API do tmdb aqui
- Volte para a pasta raiz
- Instale as dependências do PHP antes de subir o serviço `docker compose run --rm backend composer install`
- Rode o comando `docker compose up --build -d` (somente na primeira vez, depois rode apenas `docker compose up -d`)
- Configurar o backend:
    * Gerar a chave de criptografia do Laravel: `docker compose exec backend php artisan key:generate`
    * Configurar as Rotas da API: `docker compose exec backend php artisan install:api` selecione "yes"
    * Criar o Banco de Dados e Popular com Filmes: `docker compose exec backend php artisan migrate:fresh --seed`
- Acesse: `http://localhost:5173/`


### 6. Referências
<!-- Referências podem ser incluídas, caso necessário. Utilize o padrão ABNT. -->

THE MOVIE DATABASE (TMDb). **API Documentation**. Disponível em: https://developer.themoviedb.org/docs. Acesso em: 15 nov. 2025.

LARAVEL. **Documentation**. Disponível em: https://laravel.com/docs/11.x. Acesso em: 15 nov. 2025.

REACT. **Documentation**. Disponível em: https://react.dev/learn. Acesso em: 15 nov. 2025.