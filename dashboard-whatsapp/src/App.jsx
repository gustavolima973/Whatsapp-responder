import { useEffect, useState } from 'react';
import api from './services/api';

function App() {
  const [contatos, setContatos] = useState([]);

  useEffect(() => {
  async function carregarContatos() {
    console.log('[DEBUG] Buscando contatos...');
    try {
      const resposta = await api.get('/contatos');
      console.log('[DEBUG] Contatos recebidos:', resposta.data);
      setContatos(resposta.data);
    } catch (erro) {
      console.error('[ERRO] Falha ao buscar contatos:', erro);
    }
  }

  carregarContatos();
}, []);


  return (
    <div style={{ padding: '2rem' }}>
      <h1>📇 Lista de Contatos</h1>
      <ul>
        {contatos.map((c) => (
          <li key={c.numero}>
            <strong>{c.nome}</strong> – {c.numero}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
