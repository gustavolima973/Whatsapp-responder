const { listarContatos } = require('./src/contatoHelper');
const { listarMensagens } = require('./src/mensagemHelper');

function listarTodosContatos() {
    const contatos = listarContatos();
    console.log('\n📇 Todos os contatos:');
    console.table(contatos);
}

function listarTodasMensagens() {
    const mensagens = listarMensagens();
    console.log('\n📨 Todas as mensagens:');
    console.table(mensagens);
}

function filtrarMensagensPorPalavra(palavra) {
    const mensagens = listarMensagens();
    const filtradas = mensagens.filter(m => m.recebida?.toLowerCase().includes(palavra.toLowerCase()));
    console.log(`\n🔍 Mensagens que contêm "${palavra}":`);
    console.table(filtradas);
}

function listarContatosQueMencionaram(palavra) {
    const mensagens = listarMensagens();
    const contatos = new Map();

    mensagens.forEach(m => {
        if (m.recebida?.toLowerCase().includes(palavra.toLowerCase())) {
            contatos.set(m.numero, m.nome);
        }
    });

    console.log(`\n📌 Contatos que mencionaram "${palavra}":`);
    console.table([...contatos.entries()].map(([numero, nome]) => ({ numero, nome })));
}

// Execução:
listarTodosContatos();
listarTodasMensagens();
filtrarMensagensPorPalavra('catálogo');
listarContatosQueMencionaram('catálogo');
