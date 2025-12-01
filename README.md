# E-SportsChampionship

Aplicação web para gerenciamento de um campeonato amador de League of Legends, permitindo cadastro e listagem de equipes e jogadores com controle de acesso via sessão.

## Visão geral

- **Tema**: Campeonato amador de E-Sports (LoL) com foco em integração e competitividade amistosa.
- **Objetivo**: Auxiliar a coordenação do evento no registro de equipes e jogadores.

## Funcionalidades

- Autenticação com login e logout.
- Registro de equipes com nome, capitão e contato.
- Registro de jogadores vinculados à equipe com função, elo e gênero.
- Validações no servidor garantindo obrigatoriedade dos campos.
- Limite de cinco jogadores por equipe e função única por time.
- Listagens atualizadas após cada cadastro.
- Exibição da data/hora do último acesso via cookie após login.

## Tecnologias

- Node.js 20+
- Express
- express-session
- cookie-parser
- Bootstrap 5 (CDN)

## Como executar

1. Instale dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor:
   ```bash
   npm start
   ```
3. Acesse em `http://localhost:3000`.

Credenciais padrão:

- Usuário: `admin`
- Senha: `admin123`

## Fluxo principal

1. Acesso a `/login` e autenticação.
2. Navegação pelo menu protegido:
   - `/cadastro/equipe` para cadastrar equipes.
   - `/cadastro/jogador` para cadastrar jogadores em equipes existentes.
   - `/listagem/equipes` e `/listagem/jogadores` para consultar registros.

## Observações

- Sessões expiram após 30 minutos de inatividade.
- O formulário de jogadores renderiza o combo de equipes no servidor.
- Após cada inclusão, o usuário é redirecionado para a listagem correspondente.
