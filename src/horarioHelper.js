function dentroDoHorario() {
    const agora = new Date();

    const diaSemana = agora.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
    const hora = agora.getHours();

    const diasPermitidos = [1, 2, 3, 4, 5]; // segunda a sexta
    const horaInicio = 8;
    const horaFim = 18;

    return diasPermitidos.includes(diaSemana) && hora >= horaInicio && hora < horaFim;
}

function mensagemForaHorario(nome = '') {
    return `Olá${nome ? ', ' + nome : ''}! Nosso atendimento funciona de segunda a sexta, das 08h às 18h. Enviaremos sua resposta assim que possível. 😊`;
}

module.exports = { dentroDoHorario, mensagemForaHorario };
