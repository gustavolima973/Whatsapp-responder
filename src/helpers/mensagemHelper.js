const fs = require('fs');
const path = require('path');

const CAMINHO_ARQUIVO = path.join(__dirname, '../data/mensagens.json');

// Garante que o arquivo exista
if (!fs.existsSync(CAMINHO_ARQUIVO)) {
  fs.writeFileSync(CAMINHO_ARQUIVO, '[]');
}

function registrarMensagem(contato, recebida, resposta) {
  const mensagens = listarMensagens();
  mensagens.push({
    nome: contato.nome,
    numero: contato.numero,
    recebida,
    resposta,
    timestamp: new Date().toISOString()
  });

  fs.writeFileSync(CAMINHO_ARQUIVO, JSON.stringify(mensagens, null, 2));
}

function listarMensagens() {
  try {
    const dados = fs.readFileSync(CAMINHO_ARQUIVO, 'utf-8');
    return JSON.parse(dados);
  } catch (erro) {
    return [];
  }
}

module.exports = {
  registrarMensagem,
  listarMensagens
};
