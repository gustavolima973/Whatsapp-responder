const fs = require('fs');

const pastas = [
  './sessions',
  './data',
  './exportados',
  './assets'
];

function verificarPastas() {
  pastas.forEach((pasta) => {
    if (!fs.existsSync(pasta)) {
      fs.mkdirSync(pasta, { recursive: true });
      console.log(`[PASTA] Criada: ${pasta}`);
    }
  });
}

module.exports = { verificarPastas };
