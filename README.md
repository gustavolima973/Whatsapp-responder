🤖 WhatsApp Bot Node.js

Esse projeto é um bot de atendimento automático via WhatsApp, desenvolvido em Node.js com a biblioteca [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js).
Foi construído com foco em modularidade, evolução por fases e integração futura com um sistema de disparo de mensagens.


✅ Funcionalidades implementadas (Fase 1)

* Conexão automática com WhatsApp Web via QR Code
* Respostas automáticas baseadas em palavras-chave
* Comandos com prefixo `!` (ex: `!ajuda`, `!horario`, `!catalogo`)
* Personalização com o nome do contato
* Registro automático de contatos em planilha Excel
* Registro das mensagens trocadas em planilha
* Controle de horário de atendimento (ex: seg-sex, 08h-18h)
* Ignora grupos e mensagens de status
* Modo de teste local com mensagens simuladas


📁 Estrutura do projeto

```
whatsapp-bot-node/
├── data/                   # Contatos e mensagens salvos (.xlsx)
├── sessions/               # Sessão do WhatsApp Web (gerada automaticamente)
├── src/
│   ├── bot.js              # Arquivo principal
│   ├── comandos.js         # Lista de comandos com !prefixo
│   ├── contatoHelper.js    # Registro de contatos
│   ├── horarioHelper.js    # Controle de horário de atendimento
│   ├── mensagemHelper.js   # Registro de mensagens
│   ├── respostas.js        # Lista de respostas por palavras-chave
│   └── simularMensagens.js # Simula mensagens para testes locais
├── package.json
├── package-lock.json
└── README.md
```


🚀 Como executar

```bash
# Instale as dependências
npm install

# Inicie o bot (escaneie o QR Code no terminal)
node src/bot.js
```

 ✅ Testes locais com simulação

```bash
node src/simularMensagens.js
```


 📌 Comandos disponíveis (`comandos.js`)

* `!ajuda` – Lista de comandos
* `!catalogo` – Link para visualizar produtos
* `!horario` – Informa o horário de atendimento


📌 Palavras-chave configuradas (`respostas.js`)

Respostas personalizadas são disparadas quando palavras como "oi", "catálogo", "entrega", etc. são detectadas.


📦 Futuras melhorias (Fase 2 e adiante)

* Envio automático de catálogo em PDF
* Integração com links de pagamento (Pix, Mercado Pago, etc)
* Disparos agendados e segmentação de contatos
* IA para entendimento de intenções (ChatGPT ou NLP)
* Painel de controle web


🔒 Observação

Este projeto é apenas para fins educacionais. O uso de bots no WhatsApp deve seguir as diretrizes da plataforma.



Desenvolvido por [Gustavo Lima](https://github.com/gustavolima973) | Engenharia de Software – UnB
