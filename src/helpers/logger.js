const chalk = require('chalk');

function log(msg, tipo = 'BOT') {
  const agora = new Date().toLocaleString('pt-BR');
  const cores = {
    BOT: chalk.blue.bold('[BOT]'),
    API: chalk.green.bold('[API]'),
    ERRO: chalk.red.bold('[ERRO]'),
    DEBUG: chalk.yellow.bold('[DEBUG]'),
    PADRAO: chalk.white.bold(`[${tipo}]`)
  };

  const prefixo = cores[tipo] || cores.PADRAO;
  console.log(`${prefixo} ${chalk.gray(agora)} → ${msg}`);
}

module.exports = { log };
