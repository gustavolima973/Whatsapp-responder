const { Client, LocalAuth, MessageMedia, Buttons } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { salvarContato, listarContatos } = require('../helpers/contatoHelper');
const { registrarMensagem, listarMensagens } = require('../helpers/mensagemHelper');
const { exportarContatosPorPalavra } = require('../helpers/exportarHelper');
const { log } = require('../helpers/logger');
const respostas = require('./respostas');
const comandos = require('./comandos');
const { dentroDoHorario, mensagemForaHorario } = require('./horarioHelper');
const config = require('../config/config.json');


const estados = new Map();

function formatarNumero(senderId) {
  return senderId.replace('@c.us', '');
}

async function responderComando(comandoCompleto, message, nomeContato, numero, texto) {
  const [comando, ...args] = comandoCompleto.split(' ');
  const param = args.join(' ').trim();

  if (comando === 'menu') {
    estados.set(message.from, 'menu');
    await message.reply(
      `📋 Painel Administrativo\n` +
      `1️⃣ Listar contatos salvos\n` +
      `2️⃣ Ver últimas mensagens\n` +
      `3️⃣ Palavras mais faladas\n\n` +
      `Digite o número da opção desejada:`
    );
    return;
  }

  if (comando === 'disparar' && param) {
    const mensagens = listarMensagens();
    const contatosUnicos = new Map();

    for (const msg of mensagens) {
      if (msg.recebida?.toLowerCase().includes(param.toLowerCase())) {
        contatosUnicos.set(msg.numero, msg.nome);
      }
    }

    if (contatosUnicos.size === 0) {
      await message.reply(`Nenhum contato mencionou a palavra "${param}".`);
      return;
    }

    await message.reply(`🔄 Disparando para ${contatosUnicos.size} contatos que mencionaram "${param}"...`);

    for (const [numero, nome] of contatosUnicos.entries()) {
      const chatId = `${numero}@c.us`;
      const msgPersonalizada = `Olá, ${nome}! Vi que você mencionou "${param}". Posso te ajudar com isso? 😊`;

      await message.client.sendMessage(chatId, msgPersonalizada);
      registrarMensagem({ numero, nome }, `[Disparo: ${param}]`, msgPersonalizada);
      log(`Enviado para ${nome} (${numero})`, 'BOT');
    }

    await message.reply('✅ Disparo finalizado!');
    return;
  }

  if (comando === 'exportar' && param) {
    const mensagens = listarMensagens();
    const caminho = await exportarContatosPorPalavra(param, mensagens, `contatos_${param}.xlsx`);

    if (!caminho) {
      await message.reply(`Nenhum contato mencionou "${param}".`);
      return;
    }

    const media = MessageMedia.fromFilePath(caminho);
    await message.reply(`📤 Exportação concluída! Aqui estão os contatos que mencionaram "${param}":`);
    await message.reply(media);
    return;
  }

  if (comando === 'menu-botoes') {
    const botoes = new Buttons(
      'Como posso te ajudar? 👇',
      [
        { body: '📦 Ver Catálogo' },
        { body: '💬 Falar com Atendente' },
        { body: '💳 Formas de Pagamento' }
      ],
      'Menu Principal',
      'Escolha uma opção'
    );
    await message.reply(botoes);
    return;
  }

  if (comandos[comando]) {
    const resposta = comandos[comando].resposta();

    if (resposta === '__enviar_catalogo__') {
      const pdf = MessageMedia.fromFilePath('./assets/catalogo.pdf');
      const imagem = MessageMedia.fromFilePath('./assets/catalogo.jpg');

      await message.reply('Enviando catálogo em PDF e imagem... 📦');
      await message.reply(pdf);
      await message.reply(imagem);

      registrarMensagem({ numero, nome: nomeContato }, texto, '[Catálogo enviado]');
      log('Catálogo enviado', 'BOT');
    } else {
      await message.reply(resposta);
      registrarMensagem({ numero, nome: nomeContato }, texto, resposta);
      log(`Comando executado: !${comando}`, 'DEBUG');
    }
    return;
  }

  const erro = 'Comando não reconhecido. Use !ajuda para ver os disponíveis.';
  await message.reply(erro);
  registrarMensagem({ numero, nome: nomeContato }, texto, erro);
  log(`Comando inválido: !${comandoCompleto}`, 'ERRO');
}

log('Iniciando o bot...', 'BOT');

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: './sessions' })
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  log('Escaneie o QR code acima para autenticar', 'BOT');
});

client.on('ready', () => {
  log('Conectado com sucesso ao WhatsApp!', 'BOT');
});

client.on('message_create', async (message) => {
  const senderId = message.from;
  if (!senderId.endsWith('@c.us')) return;

  const texto = message.body.toLowerCase();
  const contato = await message.getContact();
  const nomeContato = contato.pushname || contato.name || 'amigo';
  const numero = formatarNumero(senderId);

  salvarContato(numero, nomeContato);

  const estadoAtual = estados.get(senderId);

  if (estadoAtual === 'menu') {
    estados.delete(senderId);

    if (texto === '1') {
      const contatos = listarContatos();
      const resposta = contatos.map(c => `💇 ${c.nome} - ${c.numero}`).join('\n');
      await message.reply(resposta || 'Nenhum contato salvo ainda.');
      return;
    }

    if (texto === '2') {
      const msgs = listarMensagens().slice(-5);
      const resposta = msgs.map(m => `📬 ${m.nome}: ${m.recebida}`).join('\n');
      await message.reply(resposta || 'Nenhuma mensagem registrada.');
      return;
    }

    if (texto === '3') {
      const mensagens = listarMensagens();
      const freq = {};
      mensagens.forEach(m => {
        const palavras = m.recebida?.toLowerCase().split(/\s+/) || [];
        palavras.forEach(p => {
          freq[p] = (freq[p] || 0) + 1;
        });
      });

      const topPalavras = Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([p, n]) => `🔹 ${p}: ${n}x`)
        .join('\n');

      await message.reply(`📊 Top palavras mencionadas:\n${topPalavras}`);
      return;
    }

    await message.reply('Opção inválida. Digite !menu para ver novamente.');
    return;
  }

  if (!dentroDoHorario()) {
    const msg = mensagemForaHorario(nomeContato);
    await message.reply(msg);
    registrarMensagem({ numero, nome: nomeContato }, texto, msg);
    log(`Fora do horário. Resposta enviada.`, 'DEBUG');
    return;
  }

  if (texto.startsWith('!')) {
    const comandoCompleto = texto.slice(1);
    await responderComando(comandoCompleto, message, nomeContato, numero, texto);
    return;
  }

  // Botões
  if (texto === '📦 Ver Catálogo') {
    const pdf = MessageMedia.fromFilePath('./assets/catalogo.pdf');
    const imagem = MessageMedia.fromFilePath('./assets/catalogo.jpg');
    await message.reply('Aqui está nosso catálogo atualizado! 📦');
    await message.reply(pdf);
    await message.reply(imagem);
    return;
  }

  if (texto === '💬 Falar com Atendente') {
    await message.reply('Nosso atendimento está disponível de segunda a sexta, das 08h às 18h. Em breve alguém falará com você! 🤝');
    return;
  }

  if (texto === '💳 Formas de Pagamento') {
    await message.reply('Aceitamos Pix, cartão e boleto. Consulte condições especiais com o atendimento. 💳');
    return;
  }

  for (const regra of respostas) {
    for (const palavra of regra.palavras) {
      if (texto.includes(palavra)) {
        const aleatoria = regra.respostas[Math.floor(Math.random() * regra.respostas.length)];
        const respostaFinal = aleatoria.replace('{nome}', nomeContato);
        await message.reply(respostaFinal);
        registrarMensagem({ numero, nome: nomeContato }, texto, respostaFinal);
        log(`Respondeu com: ${respostaFinal}`, 'BOT');
        return;
      }
    }
  }

  log('Nenhuma palavra-chave reconhecida.', 'DEBUG');
  registrarMensagem({ numero, nome: nomeContato }, texto, '');
});

client.initialize();

process.on('unhandledRejection', (reason) => {
  log(`ERRO NÃO TRATADO: ${reason}`, 'ERRO');
});
