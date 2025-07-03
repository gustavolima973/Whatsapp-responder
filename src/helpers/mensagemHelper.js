const fs = require('fs');
const XLSX = require('xlsx');

const caminhoArquivo = './data/mensagens.xlsx';

function registrarMensagem(contato, mensagemRecebida, respostaEnviada = '') {
    let mensagens = [];

    if (!fs.existsSync('./data')) fs.mkdirSync('./data');

    if (fs.existsSync(caminhoArquivo)) {
        const workbook = XLSX.readFile(caminhoArquivo);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        mensagens = XLSX.utils.sheet_to_json(sheet);
    }

    mensagens.push({
        numero: contato.numero,
        nome: contato.nome,
        data: new Date().toLocaleString(),
        recebida: mensagemRecebida,
        resposta: respostaEnviada
    });

    const novaPlanilha = XLSX.utils.json_to_sheet(mensagens);
    const novoWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(novoWorkbook, novaPlanilha, 'Mensagens');
    XLSX.writeFile(novoWorkbook, caminhoArquivo);

    console.log(`[📝] Mensagem registrada: ${contato.numero} - "${mensagemRecebida}"`);
const XLSX = require('xlsx');
const fs = require('fs');

const caminhoMensagens = './data/mensagens.xlsx';

function listarMensagens() {
    if (!fs.existsSync(caminhoMensagens)) return [];

    const workbook = XLSX.readFile(caminhoMensagens);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet); // [{ numero, nome, data, recebida, resposta }, ...]
}

module.exports = { registrarMensagem, listarMensagens };
}
