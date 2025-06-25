const comandos = {
    ajuda: {
        descricao: 'Lista de comandos disponíveis',
        resposta: () => {
            return Object.entries(comandos)
                .map(([cmd, dados]) => `!${cmd} - ${dados.descricao}`)
                .join('\n');
        }
    },
    catalogo: {
        descricao: 'Envia o link do catálogo atual',
        resposta: () => 'Veja nosso catálogo aqui: https://linkcatalogo.com 📦'
    },
    horario: {
        descricao: 'Informa o horário de atendimento',
        resposta: () => 'Atendemos de segunda a sexta, das 08h às 18h. ⏰'
    }
};

module.exports = comandos;
