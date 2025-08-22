// backend/db.js
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'seu_usuario', // ajuste conforme seu usuário
  password: 'sua_senha', // ajuste conforme sua senha
  database: 'sua_base_de_dados' // ajuste conforme sua base de dados
});

connection.connect(err => {
  if (err) throw err;
  console.log('Conectado ao MySQL');
});

module.exports = connection;