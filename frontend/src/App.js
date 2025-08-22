// frontend/src/App.js
import React from 'react';
import CadastroProduto from './components/CadastroProduto';

function App() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center my-8 text-blue-700">
        Cadastro de Produtos
      </h1>
      <CadastroProduto />
    </div>
  );
}

export default App;