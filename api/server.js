const express = require('express');
const cors = require('cors'); // ✅ importa o CORS
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors()); // ✅ habilita o CORS para todas as origens
app.use(express.json());

// 👉 Endpoint para retornar contatos
app.get('/contatos', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'contatos.json');

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const contatos = JSON.parse(data);
    res.json(contatos);
  } catch (err) {
    console.error('[ERRO] Falha ao ler contatos:', err);
    res.status(500).json({ erro: 'Erro ao carregar contatos' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
});
