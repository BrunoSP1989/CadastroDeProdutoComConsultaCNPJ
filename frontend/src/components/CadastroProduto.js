import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CadastroProduto() {
  const [form, setForm] = useState({
    nome: '',
    setor: '',
    estoque: '',
    preco_custo: '',
    preco_venda: ''
  });

  const [produtos, setProdutos] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [produtoDetalhe, setProdutoDetalhe] = useState(null);
  const [mensagem, setMensagem] = useState(''); // Novo estado para mensagens

  // Estados para informações da loja
  const [cnpj, setCnpj] = useState('');
  const [loja, setLoja] = useState({
    nome: '',
    cnpj: '',
    ie: '',
    telefone: '',
    endereco: ''
  });
  const [buscandoCnpj, setBuscandoCnpj] = useState(false);
  const [erroCnpj, setErroCnpj] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (modoEdicao && produtoEditando) {
        await axios.put(`http://localhost:3001/produtos/${produtoEditando.id}`, form);
        setMensagem('Produto atualizado com sucesso!');
        setModoEdicao(false);
        setProdutoEditando(null);
      } else {
        await axios.post('http://localhost:3001/produtos', form);
        setMensagem('Produto cadastrado com sucesso!');
      }
      setForm({ nome: '', setor: '', estoque: '', preco_custo: '', preco_venda: '' });
      buscarProdutos();
    } catch (err) {
      setMensagem('Erro ao salvar produto');
    }
    setTimeout(() => setMensagem(''), 3000); // Limpa mensagem após 3s
  };

  const buscarProdutos = async () => {
    try {
      const res = await axios.get('http://localhost:3001/produtos');
      setProdutos(res.data);
    } catch (err) {
      setMensagem('Erro ao buscar produtos');
      setTimeout(() => setMensagem(''), 3000);
    }
  };

  const iniciarEdicao = (produto) => {
    setModoEdicao(true);
    setProdutoEditando(produto);
    setForm({
      nome: produto.nome,
      setor: produto.setor,
      estoque: produto.estoque,
      preco_custo: produto.preco_custo,
      preco_venda: produto.preco_venda
    });
  };

  const deletarProduto = async (id) => {
    // Confirmação na tela
    if (window.confirm) {
      setMensagem('Excluindo produto...');
    }
    try {
      await axios.delete(`http://localhost:3001/produtos/${id}`);
      setMensagem('Produto excluído com sucesso!');
      buscarProdutos();
    } catch (err) {
      setMensagem('Erro ao deletar produto');
    }
    setTimeout(() => setMensagem(''), 3000);
  };

  // Função para buscar dados do CNPJ usando a API pública receitaws
  const buscarCnpj = async () => {
    if (!cnpj || cnpj.length < 14) {
      setErroCnpj('Digite um CNPJ válido');
      return;
    }
    setErroCnpj('');
    setBuscandoCnpj(true);
    try {
      // ...dentro da função buscarCnpj...
      const res = await axios.get(`http://localhost:3001/proxy-cnpj/${cnpj.replace(/\D/g, '')}`);
      if (res.data.status === 'ERROR') {
        setErroCnpj('CNPJ não encontrado');
        setBuscandoCnpj(false);
        return;
      }
      setLoja({
        nome: res.data.nome || '',
        cnpj: res.data.cnpj || cnpj,
        ie: res.data.inscricao_estadual || '',
        telefone: res.data.telefone || '',
        endereco: `${res.data.logradouro || ''}, ${res.data.numero || ''} - ${res.data.bairro || ''}, ${res.data.municipio || ''} - ${res.data.uf || ''}, CEP: ${res.data.cep || ''}`
      });
    } catch (err) {
      setErroCnpj('Erro ao buscar CNPJ', err);
    }
    setBuscandoCnpj(false);
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        {modoEdicao ? 'Editar Produto' : 'Cadastro de Produto'}
      </h2>

      {/* Informações da Loja */}
      <div className="mb-8 p-4 border rounded-md bg-gray-50 shadow">
        <h3 className="text-lg font-semibold mb-4 text-blue-700">Informações da Loja</h3>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
            <input
              type="text"
              value={cnpj}
              onChange={e => setCnpj(e.target.value.replace(/\D/g, '').slice(0, 14))}
              placeholder="Digite o CNPJ"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={buscarCnpj}
            disabled={buscandoCnpj}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {buscandoCnpj ? 'Buscando...' : 'Buscar CNPJ'}
          </button>
        </div>
        {erroCnpj && <div className="text-red-600 mt-2">{erroCnpj}</div>}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
            <input
              type="text"
              value={loja.nome}
              readOnly
              className="w-full px-4 py-2 border rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">IE</label>
            <input
              type="text"
              value={loja.ie}
              readOnly
              className="w-full px-4 py-2 border rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Telefone</label>
            <input
              type="text"
              value={loja.telefone}
              readOnly
              className="w-full px-4 py-2 border rounded-md bg-gray-100"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Endereço</label>
            <input
              type="text"
              value={loja.endereco}
              readOnly
              className="w-full px-4 py-2 border rounded-md bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Mensagem de confirmação */}
      {mensagem && (
        <div className="mb-4 px-4 py-2 rounded bg-green-100 text-green-800 text-center font-semibold shadow">
          {mensagem}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <input name="setor" placeholder="Setor" value={form.setor} onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <input name="estoque" type="number" placeholder="Estoque" value={form.estoque} onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <input name="preco_custo" type="number" step="0.01" placeholder="Preço de Custo" value={form.preco_custo} onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          <input name="preco_venda" type="number" step="0.01" placeholder="Preço de Venda" value={form.preco_venda} onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />

          <button type="submit"
            className={`w-full py-2 rounded-md transition duration-200 ${
              modoEdicao
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}>
            {modoEdicao ? 'Salvar Alterações' : 'Cadastrar Produto'}
          </button>
        </form>

        {/* Lista de Produtos */}
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 text-center">Produtos Cadastrados</h3>
          {produtos.length === 0 ? (
            <p className="text-gray-500">Nenhum produto cadastrado ainda.</p>
          ) : (
            <ul className="space-y-3">
              {produtos.map(prod => (
                <li key={prod.id} className="border p-4 rounded-md bg-gray-50 shadow-sm">
                  <p><strong>Nome:</strong> {prod.nome}</p>
                  <div className="mt-2 flex gap-4">
                    <button onClick={() => iniciarEdicao(prod)} className="text-sm text-blue-600 hover:underline">
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Deseja realmente excluir este produto?')) {
                          deletarProduto(prod.id);
                        }
                      }}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                    <button onClick={() => setProdutoDetalhe(prod)} className="text-sm text-green-600 hover:underline">
                      Detalhes
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Detalhes do Produto */}
          {produtoDetalhe && (
            <div className="mt-6 p-4 border rounded-md bg-white shadow-lg">
              <h4 className="text-lg font-bold mb-2">Detalhes do Produto</h4>
              <p><strong>Nome:</strong> {produtoDetalhe.nome}</p>
              <p><strong>Setor:</strong> {produtoDetalhe.setor}</p>
              <p><strong>Estoque:</strong> {produtoDetalhe.estoque}</p>
              <p><strong>Preço de Custo:</strong> R$ {produtoDetalhe.preco_custo}</p>
              <p><strong>Preço de Venda:</strong> R$ {produtoDetalhe.preco_venda}</p>
              <p><strong>Margem de Lucro:</strong> {produtoDetalhe.margem_lucro}%</p>
              <button
                className="mt-2 px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setProdutoDetalhe(null)}
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CadastroProduto;