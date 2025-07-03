const { registrarMensagem } = require('../helpers/mensagemHelper');
const { salvarContato } = require('../helpers/contatoHelper');
const { listarMensagens } = require('../helpers/mensagemHelper');
const respostas = require('../bot/respostas');


// Simula uma mensagem recebida
async function simularMensagem(numero, nome, texto) {
    const contato = {
        numero,
        nome
    };

    console.log(`[🧪] Simulando mensagem de ${nome} (${numero}): "${texto}"`);

    salvarContato(numero, nome); // registra contato
    let respostaEncontrada = '';

    for (const regra of respostas) {
        for (const palavra of regra.palavras) {
            if (texto.toLowerCase().includes(palavra)) {
                respostaEncontrada = regra.resposta.replace('{nome}', nome);
                console.log(`[🤖] Resposta simulada: ${respostaEncontrada}`);
                break;
            }
        }
        if (respostaEncontrada) break;
    }

    registrarMensagem(contato, texto, respostaEncontrada);
    console.log(`[📝] Registro concluído!\n`);
}

// Lista de mensagens para simular
const testes = [
    { numero: '5581988880010', nome: 'Clara', texto: '!exportar catálogo' },
    { numero: '5581988880001', nome: 'Ana', texto: 'oi' },
    { numero: '5581988880002', nome: 'João', texto: 'quero ver o catálogo' },
    { numero: '5581988880003', nome: 'Lucas', texto: 'vocês entregam?' },
    { numero: '5581988880004', nome: 'Mariana', texto: 'qual o horário?' },
    { numero: '5581988880005', nome: 'Thiago', texto: 'quanto custa?' },
    { numero: '5581988880006', nome: 'Bruna', texto: 'mensagem aleatória que não bate' }
];

// Executa os testes
(async () => {
    for (const teste of testes) {
        await simularMensagem(teste.numero, teste.nome, teste.texto);
    }
})()