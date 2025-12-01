import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";

const host = "localhost";
const port = 3000;

const app = express();
const ListaEquipe = [];
const jogadores = [];

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: "minh4Chav3S3cr3t4",
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 30,
        },
    })
);

app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.send(`
            <!DOCTYPE html>
            <html lang="pt-BR">
                <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Login</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" />
                <style>
                body {
                background: #f4f5f7;
                font-family: "Segoe UI", sans-serif;
                }
                .card-custom {
                border-radius: 10px;
                border: 1px solid #ddd;
                }
                .title {
                font-weight: 600;
                color: #333;
                }
                </style>
                </head>
                <body>
                    <div class="d-flex justify-content-center align-items-center vh-100 p-3">
                        <div class="card card-custom shadow-sm p-4" style="width: 360px; background: #fff;">
                            <h4 class="text-center mb-4 title">Login do Sistema</h4>  
                                <form method="POST" action="/login">
                                    <div class="mb-3">
                                        <label class="form-label">Usuário</label>
                                        <input type="text" class="form-control" name="username" />
                                    </div>
                                    <div class="mb-4">
                                        <label class="form-label">Senha</label>
                                        <input type="password" class="form-control" name="password" />
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100">Entrar</button>
                                </form>
                        </div>
                    </div>
                </body>
                </html>`);
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "admin123") {
        req.session.user = {
            nome: "Administrador",
            login: username,
        };

        const dataAtual = new Date();
        res.cookie("ultimoAcesso", dataAtual.toLocaleString());

        res.redirect("/home");
    } else {
        let conteudo = `<!DOCTYPE html>
            <html lang="pt-BR">
                <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Login</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" />
                <style>
                body {
                background: #f4f5f7;
                font-family: "Segoe UI", sans-serif;
                }
                .card-custom {
                border-radius: 10px;
                border: 1px solid #ddd;
                }
                .title {
                font-weight: 600;
                color: #333;
                }
                </style>
                </head>
                <body>
                    <div class="d-flex justify-content-center align-items-center vh-100 p-3">
                        <div class="card card-custom shadow-sm p-4" style="width: 360px; background: #fff;">
                            <h4 class="text-center mb-4 title">Login do Sistema</h4>  
                                <form method="POST" action="/login">
                                    <div class="mb-3">
                                        <label class="form-label">Usuário</label>
                                        <input type="text" class="form-control" name="username" value="${username}" />
                                       `
        if (!username) {
            conteudo += `<div class="form-text text-danger">O campo usuário é obrigatório.</div>`;
        }

        conteudo += `</div>
                                    <div class="mb-4">
                                        <label class="form-label">Senha</label>
                                        <input type="password" class="form-control" name="password" />
                                        `
        if (!password) {
            conteudo += `<div class="form-text text-danger">O campo senha é obrigatório.</div>`;
        }
        conteudo += `  </div >
            <button type="submit" class="btn btn-primary w-100">Entrar</button>
                                </form >
                        </div >
                    </div >
                </body >
                </html > `;
        res.setHeader("Content-Type", "text/html");
        res.send(conteudo);
    }
});

app.get("/logout", auth, (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

app.get("/home", auth, (req, res) => {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.setHeader("Content-Type", "text/html");
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Home</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" />
        </head>
        <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand fw-semibold" href="/home">E-Sports</a>
                <span class="navbar-text text-light me-3">
                    Último acesso: ${req.cookies.ultimoAcesso || ""}
                </span>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                        aria-controls="navbarNav" aria-expanded="false" aria-label="Alternar navegação">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <a class="nav-link active" href="/home">Home</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                Cadastro
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/cadastro/equipe">Cadastro de Equipes</a></li>
                                <li><a class="dropdown-item" href="/cadastro/jogador">Cadastro de Jogadores</a></li>
                            </ul>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                Listagens
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/listagem/equipes">Listagem de Equipes</a></li>
                                <li><a class="dropdown-item" href="/listagem/jogadores">Listagem de Jogadores</a></li>
                            </ul>
                        </li>
                    </ul>
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link text-danger" href="/logout">Sair</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="container mt-4">
            <h3 class="mb-3">Bem-vindo, ${req.session.user.nome}!</h3>
            <p>Use o menu acima ou os botões abaixo para navegar pelo sistema.</p>
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <h5 class="card-title">Regras do Campeonato</h5>
                    <ul>
                        <li>Cada equipe deve conter 5 jogadores.</li>
                        <li>Jogadores só podem estar registrados em uma equipe.</li>
                        <li>Somente jogadores cadastrados poderão participar.</li>
                    </ul>
                </div>
            </div>
            <div class="row g-3">
                <div class="col-md-6">
                    <div class="card shadow-sm h-100">
                        <div class="card-body">
                            <h5 class="card-title">Cadastro de Equipes</h5>
                            <p class="card-text">Cadastre novas equipes participantes do campeonato.</p>
                            <a href="/cadastro/equipe" class="btn btn-primary">Ir para Cadastro de Equipes</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card shadow-sm h-100">
                        <div class="card-body">
                            <h5 class="card-title">Cadastro de Jogadores</h5>
                            <p class="card-text">Adicione jogadores às equipes cadastradas.</p>
                            <a href="/cadastro/jogador" class="btn btn-primary">Ir para Cadastro de Jogadores</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
    `);

});

app.get("/cadastro/equipe", auth, (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Equipe</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>

        <body class="bg-light">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div class="container-fluid">
                <a class="navbar-brand fw-semibold" href="/home">E-Sports</a>
                <span class="navbar-text text-light me-3">
                    Último acesso: ${req.cookies.ultimoAcesso || ""}
                </span>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                        aria-label="Alternar navegação">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">

                        <li class="nav-item">
                            <a class="nav-link" href="/home">Home</a>
                        </li>

                        <!-- Menu Cadastro -->
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle active" href="#" role="button" data-bs-toggle="dropdown">
                                Cadastro
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/cadastro/equipe">Cadastro de Equipes</a></li>
                                <li><a class="dropdown-item" href="/cadastro/jogador">Cadastro de Jogadores</a></li>
                            </ul>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                Listagens
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/listagem/equipes">Listagem de Equipes</a></li>
                                <li><a class="dropdown-item" href="/listagem/jogadores">Listagem de Jogadores</a></li>
                            </ul>
                        </li>

                    </ul>

                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link text-danger" href="/logout">Sair</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="container">
            <div class="card shadow mx-auto" style="max-width: 650px;">
                <div class="card-body">

                    <h3 class="text-center mb-4">Cadastro de Equipe</h3>
                    <hr>

                    <form method="POST" action="/cadastro/equipe">

                        <div class="mb-3">
                            <label class="form-label">Nome da Equipe</label>
                            <input type="text" class="form-control" name="nomeEquipe">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Nome do Capitão Responsável</label>
                            <input type="text" class="form-control" name="capitao">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Telefone/WhatsApp do Capitão</label>
                            <input type="text" class="form-control" name="telefone" placeholder="(DDD) 9 9999-9999">
                        </div>

                        <div class="d-flex justify-content-between mt-4">
                            <a href="/home" class="btn btn-secondary">Voltar</a>
                            <button type="submit" class="btn btn-primary">Cadastrar Equipe</button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
`);

});

app.post("/cadastro/equipe", auth, (req, res) => {

    const { nomeEquipe, capitao, telefone } = req.body;

    if (nomeEquipe && capitao && telefone) {
        ListaEquipe.push({ nomeEquipe, capitao, telefone });
        return res.redirect("/listagem/equipes");
    } else {
        let conteudo = `<!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Equipe</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>

        <body class="bg-light">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div class="container-fluid">
                <a class="navbar-brand fw-semibold" href="/home">E-Sports</a>
                <span class="navbar-text text-light me-3">
                    Último acesso: ${req.cookies.ultimoAcesso || ""}
                </span>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                        aria-label="Alternar navegação">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">

                        <li class="nav-item">
                            <a class="nav-link" href="/home">Home</a>
                        </li>

                        <!-- Menu Cadastro -->
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle active" href="#" role="button" data-bs-toggle="dropdown">
                                Cadastro
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/cadastro/equipe">Cadastro de Equipes</a></li>
                                <li><a class="dropdown-item" href="/cadastro/jogador">Cadastro de Jogadores</a></li>
                            </ul>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                Listagens
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/listagem/equipes">Listagem de Equipes</a></li>
                                <li><a class="dropdown-item" href="/listagem/jogadores">Listagem de Jogadores</a></li>
                            </ul>
                        </li>

                    </ul>

                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link text-danger" href="/logout">Sair</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="container">
            <div class="card shadow mx-auto" style="max-width: 650px;">
                <div class="card-body">

                    <h3 class="text-center mb-4">Cadastro de Equipe</h3>
                    <hr>

                    <form method="POST" action="/cadastro/equipe">

                        <div class="mb-3">
                            <label class="form-label">Nome da Equipe</label>
                            <input type="text" class="form-control" name="nomeEquipe" value ="${nomeEquipe}">
                            `;
        if (!nomeEquipe) {
            conteudo += `<div class="form-text text-danger">O campo nome da equipe é obrigatório.</div>`;
        }
        conteudo += `
                        </div >

                        <div class="mb-3">
                            <label class="form-label">Nome do Capitão Responsável</label>
                            <input type="text" class="form-control" name="capitao" value ="${capitao}">
                            `;
        if (!capitao) {
            conteudo += `<div class="form-text text-danger">O campo nome do capitão é obrigatório.</div>`;
        }
        conteudo += `
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Telefone/WhatsApp do Capitão</label>
                            <input type="text" class="form-control" name="telefone" placeholder="(DDD) 9 9999-9999" value ="${telefone}">
                            `;
        if (!telefone) {
            conteudo += `<div class="form-text text-danger">O campo telefone/WhatsApp é obrigatório.</div>`;
        }
        conteudo += `
                        </div>

                        <div class="d-flex justify-content-between mt-4">
                            <a href="/" class="btn btn-secondary">Voltar</a>
                            <button type="submit" class="btn btn-primary">Cadastrar Equipe</button>
                        </div>

                    </form >
                </div >
            </div >
        </div >
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
        </body >
        </html > `
        res.setHeader("Content-Type", "text/html");
        res.send(conteudo);
    }
});

app.get("/listagem/equipes", auth, (req, res) => {
    let conteudo = `<!DOCTYPE html>
                    <html lang="pt-BR">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Listagem de Equipes</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
                    </head>

                    <body class="bg-light">

                    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
                        <div class="container-fluid">
                            <a class="navbar-brand fw-semibold" href="/home">E-Sports</a>
                            <span class="navbar-text text-light me-3">
                                        Último acesso: ${req.cookies.ultimoAcesso || ""}
                                    </span>

                            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                                    aria-label="Alternar navegação">
                                <span class="navbar-toggler-icon"></span>
                            </button>

                            <div class="collapse navbar-collapse" id="navbarNav">
                                <ul class="navbar-nav me-auto">

                                    <li class="nav-item">
                                        <a class="nav-link" href="/home">Home</a>
                                    </li>
                                    <li class="nav-item dropdown">
                                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                            Cadastro
                                        </a>
                                        <ul class="dropdown-menu">
                                            <li><a class="dropdown-item" href="/cadastro/equipe">Cadastro de Equipes</a></li>
                                            <li><a class="dropdown-item" href="/cadastro/jogador">Cadastro de Jogadores</a></li>
                                        </ul>
                                    </li>
                                    <li class="nav-item dropdown">
                                        <a class="nav-link dropdown-toggle active" href="#" role="button" data-bs-toggle="dropdown">
                                            Listagens
                                        </a>
                                        <ul class="dropdown-menu">
                                            <li><a class="dropdown-item active" href="/listagem/equipes">Listagem de Equipes</a></li>
                                            <li><a class="dropdown-item" href="/listagem/jogadores">Listagem de Jogadores</a></li>
                                        </ul>
                                    </li>

                                </ul>

                                <ul class="navbar-nav">
                                    <li class="nav-item">
                                        <a class="nav-link text-danger" href="/logout">Sair</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <div class="container">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h3>Equipes Cadastradas</h3>
                            <a href="/cadastro/equipe" class="btn btn-primary">+ Nova Equipe</a>
                        </div>

                        <div class="card shadow-sm">
                            <div class="card-body p-0">

                                <table class="table table-striped table-hover mb-0">
                                    <thead class="table-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Nome da Equipe</th>
                                            <th>Capitão</th>
                                            <th>Telefone</th>
                                        </tr>
                                    </thead>

                                    <tbody>`;

    if (ListaEquipe.length === 0) {
        conteudo += `
                                        <tr>
                                            <td colspan="4" class="text-center">Nenhuma equipe cadastrada.</td>
                                        </tr>
                                        `;
    } else {
        for (let i = 0; i < ListaEquipe.length; i++) {
            conteudo += `
                                        <tr>
                                            <td>${i + 1}</td>
                                            <td>${ListaEquipe[i].nomeEquipe}</td>
                                            <td>${ListaEquipe[i].capitao}</td>
                                            <td>${ListaEquipe[i].telefone}</td>   
                                        </tr>                       
                                            `;
        }
    }
    conteudo += `
                                    </tbody >
                                </table >
                            </div >
                        </div >
                        <div class="mt-3">
                            <a href="/home" class="btn btn-secondary">Voltar</a>
                        </div>
                    </div >

                            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
                    </body >
                    </html >
        `;
    res.setHeader("Content-Type", "text/html");
    res.send(conteudo);
}
);

app.get("/cadastro/jogador", auth, (req, res) => {

    let opcoesEquipes = "";
    for (let i = 0; i < ListaEquipe.length; i++) {
        opcoesEquipes += `<option value="${ListaEquipe[i].nomeEquipe}">${ListaEquipe[i].nomeEquipe}</option>`;
    }

    let conteudo = `<!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Jogador</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>

        <body class="bg-light">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div class="container-fluid">
                <a class="navbar-brand fw-semibold" href="/home">E-Sports</a>
                <span class="navbar-text text-light me-3">
                    Último acesso: ${req.cookies.ultimoAcesso || ""}
                </span>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item"><a class="nav-link" href="/home">Home</a></li>

                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                Cadastro
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/cadastro/equipe">Cadastro de Equipes</a></li>
                                <li><a class="dropdown-item" href="/cadastro/jogador">Cadastro de Jogadores</a></li>
                            </ul>
                        </li>

                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                Listagens
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/listagem/equipes">Listagem de Equipes</a></li>
                                <li><a class="dropdown-item" href="/listagem/jogadores">Listagem de Jogadores</a></li>
                            </ul>
                        </li>
                    </ul>

                    <ul class="navbar-nav">
                        <li class="nav-item"><a class="nav-link text-danger" href="/logout">Sair</a></li>
                    </ul>
                </div>
            </div>
        </nav>

        <div class="container">
            <div class="card shadow mx-auto" style="max-width: 650px;">
                <div class="card-body">
                    <h3 class="text-center mb-4">Cadastro de Jogador</h3>
                    <hr>

                    <form method="POST" action="/cadastro/jogador">

                        <div class="mb-3">
                            <label class="form-label">Nome do Jogador</label>
                            <input type="text" class="form-control" name="nome">
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Nickname</label>
                            <input type="text" class="form-control" name="nickname">
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Função</label>
                            <select class="form-select" name="funcao">
                                <option value="" disabled selected>Selecione uma função</option>
                                <option value="top">top</option>
                                <option value="jungle">jungle</option>
                                <option value="mid">mid</option>
                                <option value="atirador">atirador</option>
                                <option value="suporte">suporte</option>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Elo</label>
                            <select class="form-select" name="elo">
                                <option value="" disabled selected>Selecione o seu elo</option>
                                <option value="Ferro">Ferro</option>
                                <option value="Bronze">Bronze</option>
                                <option value="Prata">Prata</option>
                                <option value="Ouro">Ouro</option>
                                <option value="Platina">Platina</option>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Genero</label>
                            <select class="form-select" name="genero">
                                <option value="" disabled selected>Selecione o seu genero</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Equipe</label>
                            <select class="form-select" name="equipe">
                                <option value="" disabled selected>Selecione uma equipe</option>
                                ${opcoesEquipes}
                            </select>
                        </div>

                        <div class="d-flex justify-content-between mt-4">
                            <a href="/home" class="btn btn-secondary">Voltar</a>
                            <button type="submit" class="btn btn-primary">Cadastrar Jogador</button>
                        </div>

                    </form>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
    `;
    res.setHeader("Content-Type", "text/html");
    res.send(conteudo);
});

app.post("/cadastro/jogador", auth, (req, res) => {
    const { nome, equipe, funcao, elo, genero, nickname } = req.body;

    let opcoesEquipes = "";
    for (let i = 0; i < ListaEquipe.length; i++) {
        opcoesEquipes += `<option value="${ListaEquipe[i].nomeEquipe}">${ListaEquipe[i].nomeEquipe}</option>`;
    }

    let quantidadeJogadores = 0;
    for (let i = 0; i < jogadores.length; i++) {
        if (jogadores[i].equipe === equipe) {
            quantidadeJogadores++;
        }
    }

    let erroEquipe = "";
    if (quantidadeJogadores >= 5) {
        erroEquipe = `A equipe ${equipe} já possui 5 jogadores cadastrados.`;
    }

    let funcaoOcupada = false;
    for (let i = 0; i < jogadores.length; i++) {
        if (jogadores[i].equipe === equipe && jogadores[i].funcao === funcao) {
            funcaoOcupada = true;
        }
    }

    if (!erroEquipe && !funcaoOcupada && nome && equipe && funcao && elo && genero && nickname) {
        jogadores.push({ nome, equipe, funcao, elo, genero, nickname });
        return res.redirect("/listagem/jogadores");
    }

    let conteudo = `<!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cadastro de Jogador</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>

    <body class="bg-light">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div class="container-fluid">
            <a class="navbar-brand fw-semibold" href="/home">E-Sports</a>
            <span class="navbar-text text-light me-3">
                Último acesso: ${req.cookies.ultimoAcesso || ""}
            </span>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item"><a class="nav-link" href="/home">Home</a></li>

                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                            Cadastro
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="/cadastro/equipe">Cadastro de Equipes</a></li>
                            <li><a class="dropdown-item" href="/cadastro/jogador">Cadastro de Jogadores</a></li>
                        </ul>
                    </li>

                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                            Listagens
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="/listagem/equipes">Listagem de Equipes</a></li>
                            <li><a class="dropdown-item" href="/listagem/jogadores">Listagem de Jogadores</a></li>
                        </ul>
                    </li>
                </ul>

                <ul class="navbar-nav">
                    <li class="nav-item"><a class="nav-link text-danger" href="/logout">Sair</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="card shadow mx-auto" style="max-width: 650px;">
            <div class="card-body">
                <h3 class="text-center mb-4">Cadastro de Jogador</h3>
                <hr>
    `;

    if (erroEquipe) {
        conteudo += `
            <div class="alert alert-danger text-center">
                ${erroEquipe}
            </div>
        `;
    }

    conteudo += `
                <form method="POST" action="/cadastro/jogador">

                    <div class="mb-3">
                        <label class="form-label">Nome do Jogador</label>
                        <input type="text" class="form-control" name="nome" value="${nome}">
    `;

    if (!nome) {
        conteudo += `<div class="form-text text-danger">O campo nome do jogador é obrigatório.</div>`;
    }

    conteudo += `
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Nickname</label>
                        <input type="text" class="form-control" name="nickname" value="${nickname}">
    `;

    if (!nickname) {
        conteudo += `<div class="form-text text-danger">O campo nickname é obrigatório.</div>`;
    }

    conteudo += `
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Função</label>
                        <select class="form-select" name="funcao">
                            <option value="" disabled selected>Selecione uma função</option>
                            <option value="top">top</option>
                            <option value="jungle">jungle</option>
                            <option value="mid">mid</option>
                            <option value="atirador">atirador</option>
                            <option value="suporte">suporte</option>
                        </select>
    `;

    if (!funcao) {
        conteudo += `<div class="form-text text-danger">O campo função é obrigatório.</div>`;
    } else if (funcaoOcupada) {
        conteudo += `<div class="form-text text-danger">A função ${funcao} já está ocupada nessa equipe.</div>`;
    }

    conteudo += `
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Elo</label>
                        <select class="form-select" name="elo">
                            <option value="" disabled selected>Selecione o seu elo</option>
                            <option value="Ferro">Ferro</option>
                            <option value="Bronze">Bronze</option>
                            <option value="Prata">Prata</option>
                            <option value="Ouro">Ouro</option>
                            <option value="Platina">Platina</option>
                        </select>
    `;

    if (!elo) {
        conteudo += `<div class="form-text text-danger">O campo elo é obrigatório.</div>`;
    }

    conteudo += `
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Genero</label>
                        <select class="form-select" name="genero">
                            <option value="" disabled selected>Selecione o seu genero</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Outro">Outro</option>
                        </select>
    `;

    if (!genero) {
        conteudo += `<div class="form-text text-danger">O campo gênero é obrigatório.</div>`;
    }

    conteudo += `
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Equipe</label>
                        <select class="form-select" name="equipe">
                            <option value="" disabled selected>Selecione uma equipe</option>
                            ${opcoesEquipes}
                        </select>
    `;

    if (!equipe) {
        conteudo += `<div class="form-text text-danger">O campo equipe é obrigatório.</div>`;
    }

    conteudo += `
                    </div>

                    <div class="d-flex justify-content-between mt-4">
                        <a href="/home" class="btn btn-secondary">Voltar</a>
                        <button type="submit" class="btn btn-primary">Cadastrar Jogador</button>
                    </div>

                </form>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.send(conteudo);
});

app.get("/listagem/jogadores", auth, (req, res) => {
    let conteudo = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Listagem de Jogadores</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="bg-light">

        <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div class="container-fluid">
                <a class="navbar-brand fw-semibold" href="/home">E-Sports</a>
                <span class="navbar-text text-light me-3">
                    Último acesso: ${req.cookies.ultimoAcesso || ""}
                </span>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item"><a class="nav-link" href="/home">Home</a></li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                Cadastro
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/cadastro/equipe">Cadastro de Equipes</a></li>
                                <li><a class="dropdown-item" href="/cadastro/jogador">Cadastro de Jogadores</a></li>
                            </ul>
                        </li>

                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle active" href="#" role="button" data-bs-toggle="dropdown">
                                Listagens
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/listagem/equipes">Listagem de Equipes</a></li>
                                <li><a class="dropdown-item active" href="/listagem/jogadores">Listagem de Jogadores</a></li>
                            </ul>
                        </li>
                    </ul>

                    <ul class="navbar-nav">
                        <li class="nav-item"><a class="nav-link text-danger" href="/logout">Sair</a></li>
                    </ul>
                </div>
            </div>
        </nav>

        <div class="container">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3>Jogadores por Equipe</h3>
                <a href="/cadastro/jogador" class="btn btn-primary">+ Novo Jogador</a>
            </div>
    `;

    if (jogadores.length === 0) {
        conteudo += `
            <div class="alert alert-info text-center">
                Nenhum jogador cadastrado.
            </div>
        `;
    } else {
        for (let i = 0; i < ListaEquipe.length; i++) {
            const nomeEquipe = ListaEquipe[i].nomeEquipe;
            let jogadoresEquipe = [];
            for (let j = 0; j < jogadores.length; j++) {
                if (jogadores[j].equipe === nomeEquipe) {
                    jogadoresEquipe.push(jogadores[j]);
                }
            }
            conteudo += `
                <div class="card mb-4 shadow-sm">
                    <div class="card-header bg-dark text-white">
                        <h5 class="mb-0">Equipe: ${nomeEquipe}</h5>
                    </div>
                    <div class="card-body p-0">
            `;
            if (jogadoresEquipe.length === 0) {
                conteudo += `
                    <p class="text-center p-3">Nenhum jogador nesta equipe.</p>
                `;
            } else {
                conteudo += `
                    <table class="table table-striped table-hover mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>#</th>
                                <th>Nome</th>
                                <th>Nickname</th>
                                <th>Função</th>
                                <th>Elo</th>
                                <th>Gênero</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                for (let j = 0; j < jogadoresEquipe.length; j++) {
                    conteudo += `
                        <tr>
                            <td>${j + 1}</td>
                            <td>${jogadoresEquipe[j].nome}</td>
                            <td>${jogadoresEquipe[j].nickname}</td>
                            <td>${jogadoresEquipe[j].funcao}</td>
                            <td>${jogadoresEquipe[j].elo}</td>
                            <td>${jogadoresEquipe[j].genero}</td>
                        </tr>
                    `;
                }
                conteudo += `
                        </tbody>
                    </table>
                `;
            }
            conteudo += `
                    </div>
                </div>
            `;
        }
    }
    conteudo += `
            <div class="mt-3">
                <a href="/home" class="btn btn-secondary">Voltar</a>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.send(conteudo);
});


function auth(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect("/login");
}

app.listen(port, () => {
    console.log(`Servidor rodando em http://${host}:${port}`);
});
