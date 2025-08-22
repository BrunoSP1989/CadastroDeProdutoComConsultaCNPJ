// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rota para cadastrar produto
app.post('/produtos', (req, res) => {
  const { nome, setor, estoque, preco_custo, preco_venda } = req.body;
  const margem_lucro = ((preco_venda - preco_custo) / preco_custo * 100).toFixed(2);

  const sql = 'INSERT INTO produtos (nome, setor, estoque, preco_custo, preco_venda, margem_lucro) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [nome, setor, estoque, preco_custo, preco_venda, margem_lucro], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ id: result.insertId, ...req.body, margem_lucro });
  });
});

// ✅ Nova rota para listar produtos
app.get('/produtos', (req, res) => {
  const sql = 'SELECT * FROM produtos';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});
// ✅ Nova rota para deletar produto
app.delete('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM produtos WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ success: true });
  });
});
// ✅ Nova rota para atualizar produto
app.put('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, setor, estoque, preco_custo, preco_venda } = req.body;
  const margem_lucro = ((preco_venda - preco_custo) / preco_custo * 100).toFixed(2);

  const sql = `
    UPDATE produtos 
    SET nome = ?, setor = ?, estoque = ?, preco_custo = ?, preco_venda = ?, margem_lucro = ?
    WHERE id = ?
  `;
  db.query(sql, [nome, setor, estoque, preco_custo, preco_venda, margem_lucro, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ success: true });
  });
});
// Rota para buscar CNPJ via proxy
app.get('/proxy-cnpj/:cnpj', async (req, res) => {
  try {
    const { cnpj } = req.params;
    const response = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${cnpj}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: 'Erro ao buscar CNPJ' });
  }
});

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});