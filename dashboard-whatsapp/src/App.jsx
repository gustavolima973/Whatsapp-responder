import { useEffect, useState } from 'react';
import api from './services/api';

function App() {
  const [contatos, setContatos] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true); // 👈 controle de carregamento

  useEffect(() => {
    async function carregarContatos() {
      try {
        const resposta = await api.get('/contatos');
        setContatos(resposta.data);
      } catch (erro) {
        console.error('[ERRO] Falha ao buscar contatos:', erro);
        setErro('❌ Erro ao carregar contatos. Tente novamente mais tarde.');
      } finally {
        setCarregando(false); // 👈 marca que terminou
      }
    }

    carregarContatos();
  }, []);

  
  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial' }}>
      <h1>📇 Lista de Contatos</h1>

      {carregando && <p>🔄 Carregando contatos...</p>}

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {!carregando && !erro && contatos.length === 0 && (
        <p>Nenhum contato encontrado.</p>
      )}

      {!carregando && !erro && contatos.length > 0 && (
        <ul>
          {contatos.map((c) => (
            <li key={c.numero}>
              <strong>{c.nome}</strong> – {c.numero}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
