#🛠️ Projeto de Cadastro de Produtos com Consulta de CNPJ

Este é um projeto de estudo fullstack desenvolvido com React.js, Node.js, MySQL e Tailwind CSS, que permite o cadastro, listagem, edição e exclusão de produtos, além de realizar consultas de CNPJ via API externa.
🔙 Backend

Tecnologias e bibliotecas utilizadas:
- Node.js: Ambiente de execução JavaScript fora do navegador, responsável por rodar o servidor backend.
- Express: Framework que facilita a criação de rotas HTTP (endpoints) para operações CRUD de produtos e também atua como proxy para consultas de CNPJ.
- MySQL: Banco de dados relacional utilizado para armazenar os dados dos produtos.
- mysql (npm package): Biblioteca para conectar e executar comandos SQL no MySQL a partir do Node.js.
- axios: Utilizado para fazer requisições HTTP externas, como a consulta de CNPJ na API da ReceitaWS.
- cors: Middleware que permite que o frontend acesse a API do backend mesmo estando em outra origem.
- body-parser: Middleware que interpreta o corpo das requisições HTTP em JSON, facilitando o recebimento de dados do frontend.
- db.js: Arquivo responsável pela conexão entre o Node.js e o banco MySQL.
🎨 Frontend

Tecnologias e bibliotecas utilizadas:
- React.js: Biblioteca JavaScript para construção de interfaces de usuário reativas e baseadas em componentes.
- axios: Utilizado para enviar e receber dados do backend via requisições HTTP.
- Tailwind CSS (opcional, mas recomendado): Framework de utilitários CSS que permite estilizar os componentes de forma rápida e responsiva.
