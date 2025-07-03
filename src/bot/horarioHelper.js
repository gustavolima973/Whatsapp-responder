const config = require('../config/config.json'); // ajuste o caminho conforme a estrutura real

function dentroDoHorario() {
  const agora = new Date();
  const horaAtual = agora.getHours() + agora.getMinutes() / 60;

  const [hInicio, mInicio] = config.horarioAtendimento.inicio.split(':').map(Number);
  const [hFim, mFim] = config.horarioAtendimento.fim.split(':').map(Number);

  const inicio = hInicio + mInicio / 60;
  const fim = hFim + mFim / 60;

  return horaAtual >= inicio && horaAtual <= fim;
}

function mensagemForaHorario(nome) {
  return config.mensagens.foraHorario.replace('{nome}', nome);
}

module.exports = { dentroDoHorario, mensagemForaHorario };
 