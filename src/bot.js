const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { salvarContato } = require('./contatoHelper');
const { registrarMensagem } = require('./mensagemHelper');
const respostas = require('./respostas');
const comandos = require('./comandos');
const { dentroDoHorario, mensagemForaHorario } = require('./horarioHelper');

// Utilitário para extrair número limpo
function formatarNumero(senderId) {
    return senderId.replace('@c.us', '');
}

// Lida com comandos prefixados com !
async function responderComando(comando, message, nomeContato, numero, texto) {
    if (comandos[comando]) {
        const resposta = comandos[comando].resposta();
        await message.reply(resposta);
        registrarMensagem({ numero, nome: nomeContato }, texto, resposta);
        console.log(`[⚙️] Comando executado: !${comando}`);
    } else {
        const erro = 'Comando não reconhecido. Use !ajuda para ver os disponíveis.';
        await message.reply(erro);
        registrarMensagem({ numero, nome: nomeContato }, texto, erro);
        console.log(`[⚠️] Comando inválido: !${comando}`);
    }
}

// Processa a mensagem recebida
async function processarMensagem(message) {
    const senderId = message.from;

    if (!senderId.endsWith('@c.us')) {
        console.log(`[IGNORADO] Mensagem de não-contato: ${senderId}`);
        return;
    }

    const texto = message.body.toLowerCase();
    const contato = await message.getContact();
    const nomeContato = contato.pushname || contato.name || 'amigo';
    const numero = formatarNumero(senderId);

    salvarContato(numero, nomeContato);

    // Verifica horário
    if (!dentroDoHorario()) {
        const msg = mensagemForaHorario(nomeContato);
        await message.reply(msg);
        registrarMensagem({ numero, nome: nomeContato }, texto, msg);
        console.log(`[⏰] Fora do horário. Resposta automática enviada.`);
        return;
    }

    // Verifica comando
    if (texto.startsWith('!')) {
        const comando = texto.replace('!', '').trim();
        await responderComando(comando, message, nomeContato, numero, texto);
        return;
    }

    console.log(`[📩] ${senderId} (${nomeContato}): ${texto}`);

    // Verifica palavras-chave
    for (const regra of respostas) {
        for (const palavra of regra.palavras) {
            if (texto.includes(palavra)) {
               const aleatoria = regra.respostas[Math.floor(Math.random() * regra.respostas.length)];
               const respostaFinal = aleatoria.replace('{nome}', nomeContato);

                await message.reply(respostaFinal);
                registrarMensagem({ numero, nome: nomeContato }, texto, respostaFinal);
                console.log(`[🤖] Respondeu com: ${respostaFinal}`);
                return;
            }
        }
    }

    // Nenhuma resposta configurada
    console.log('[🤖] Nenhuma palavra-chave reconhecida.');
    registrarMensagem({ numero, nome: nomeContato }, texto, '');
}

console.log('[DEBUG] Iniciando o bot...');

const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './sessions' })
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('[BOT] Escaneie o QR code acima para autenticar');
});

client.on('ready', () => {
    console.log('[BOT] Conectado com sucesso ao WhatsApp!');
});

client.on('message', processarMensagem);

client.initialize();

// Captura erros silenciosos
process.on('unhandledRejection', (reason) => {
    console.error('[ERRO NÃO TRATADO]', reason);
});
