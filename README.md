Olá usuario,

Para acessar essa aplicação você deverá realizar alguns passos a seguir:

<h1>Back End</h1>
1- baixe o arquivo database.sql e cole no seu banco de dados Mysql
Caso utilize o champ, deverá copiar o conteudo que está dentro do database.sql e colar no campo de adicionar uma nova tabela.

![instrução](https://github.com/RaphaelFiais/Shopper/assets/108894531/2f420be4-3ce7-4b62-99d0-10319386fce5)

2- conecte o seu banco de dados na aplicação.

Para conectar o banco de dados na aplicação, deverá ter acesso o host, usuario, porta, senha e nome do banco de dados

Entre no arquivo .env,  e adicione a url mysql://USER:PASSWORD@HOST:PORT/DATABASE contendo as informações do seu banco de dados

3 - Dê os seguintes comando no terminal:
- npm install \\baixar as dependencias da aplicação
- npx prisma db pull \\pegar a as tabelas no banco de dados
- npm run dev \\iniciar a aplicação

<h1>Front end</h1>

1- instale as dependecias do projeto
npm install

2- inicie a aplicação

npm run dev
