const respostas = [
    {
        palavras: ['oi', 'olá', 'bom dia', 'boa tarde', 'boa noite'],
        respostas: [
            'Olá, {nome}! Tudo bem com você? 😊',
            'Oi, {nome}! Como posso te ajudar hoje?',
            'Seja bem-vindo(a), {nome}! 👋'
        ],
    },
    {
        palavras: ['preço', 'custa', 'valor'],
        resposta: '{nome}, os valores variam! Me diga qual produto você deseja saber. 💰'
    },

  {
    palavras: ['catálogo', 'lista', 'produtos'],
    respostas: [
      'Claro {nome}, já estou enviando o catálogo! 📦',
      'Ei {nome}, confira nosso catálogo atualizado!',
    ]
  },
  // outras regras
    {
        palavras: ['entrega', 'frete', 'envio'],
        resposta: 'Fazemos entregas para todo o Brasil via correios ou motoboy, {nome}! 🚚'
    },
    {
        palavras: ['horário', 'funciona', 'atendimento'],
        resposta: 'Nosso horário de atendimento é de segunda a sexta, das 8h às 18h, {nome}. ⏰'
    }
];

module.exports = respostas;
