const fs = require('fs');
const XLSX = require('xlsx');

const caminhoArquivo = './data/contatos.xlsx';

function salvarContato(numero, nome) {
    let contatos = [];

    // Cria diretório se não existir
    if (!fs.existsSync('./data')) fs.mkdirSync('./data');

    // Se o arquivo existir, carrega os dados
    if (fs.existsSync(caminhoArquivo)) {
        const workbook = XLSX.readFile(caminhoArquivo);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        contatos = XLSX.utils.sheet_to_json(sheet);
    }

    // Verifica se já existe
    const jaExiste = contatos.some(c => c.numero === numero);
    if (jaExiste) return;

    // Adiciona novo contato
    contatos.push({
        numero,
        nome,
        data: new Date().toLocaleString()
    });

    // Salva de volta
    const novaPlanilha = XLSX.utils.json_to_sheet(contatos);
    const novoWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(novoWorkbook, novaPlanilha, 'Contatos');
    XLSX.writeFile(novoWorkbook, caminhoArquivo);

    console.log(`[📁] Novo contato salvo: ${nome} (${numero})`);
}

function listarContatos() {
    if (!fs.existsSync(caminhoArquivo)) return [];

    const workbook = XLSX.readFile(caminhoArquivo);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet); // [{ numero, nome }, ...]
}

module.exports = { salvarContato, listarContatos };
