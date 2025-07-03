// src/exportarHelper.js
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

async function exportarContatosPorPalavra(palavra, mensagens = [], nomeArquivo = 'contatos_exportados.xlsx') {
    const contatosUnicos = new Map();

    for (const msg of mensagens) {
        if (msg.recebida?.toLowerCase().includes(palavra.toLowerCase())) {
            contatosUnicos.set(msg.numero, msg.nome);
        }
    }

    if (contatosUnicos.size === 0) return null;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Contatos');

    sheet.columns = [
        { header: 'Nome', key: 'nome' },
        { header: 'Número', key: 'numero' },
    ];

    for (const [numero, nome] of contatosUnicos.entries()) {
        sheet.addRow({ nome, numero });
    }

    const pasta = path.join(__dirname, '..', 'exportados');
    if (!fs.existsSync(pasta)) fs.mkdirSync(pasta);

    const caminho = path.join(pasta, nomeArquivo);
    await workbook.xlsx.writeFile(caminho);

    return caminho;
}

module.exports = { exportarContatosPorPalavra };
