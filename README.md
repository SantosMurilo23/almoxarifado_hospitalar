# Almoxarifado Hospitalar

## Integrantes

- Murilo dos Santos de Moraes
- Leonardo Teles Pereira

Curso: Ciência da Computação
Disciplina: Desenvolvimento de Software Visual

## Resumo

Sistema acadêmico para gerenciar materiais de consumo e requisições
dos setores de um hospital. A aplicação possui interface React,
API em C# e banco SQLite. Permite cadastrar materiais e colaboradores,
registrar pedidos com vários itens e realizar atendimento parcial,
descontando do estoque apenas as quantidades efetivamente entregues.

## Tecnologias

- C# com .NET 8 e ASP.NET Core Minimal API.
- Entity Framework Core e SQLite.
- React com JavaScript/JSX e Vite.
- CSS elaborado com auxílio de IA.
- Git e GitHub para colaboração e versionamento.

## Entidades e relacionamentos

- Setor: identifica o setor de trabalho e o destino dos materiais.
- Usuario: representa o colaborador vinculado a um setor.
- Material: armazena nome, unidade de medida, estoque e situação.
- Requisicao: registra solicitante, setor, data e status do pedido.
- ItemRequisicao: relaciona materiais aos pedidos e registra as
  quantidades solicitadas e atendidas.

O usuário está associado a um setor. A requisição referencia seu
solicitante e setor, enquanto cada item referencia um material existente.

## Funcionalidades

### Materiais

Cadastro, listagem, edição, ativação/desativação e exclusão pela
interface. Materiais vinculados a requisições não podem ser excluídos,
preservando o histórico. A edição permite alterar o saldo de estoque.

### Colaboradores e setores

Cadastro de colaboradores com seleção de setor existente e ativo.
O sistema rejeita e-mail já cadastrado e armazena a senha como hash.

Os setores iniciais são UTI Azul, UTI Verde, UTI Laranja, UTI Lilás,
Ambulatório, Farmácia Central, PS - Pronto Socorro e CC - Centro Cirúrgico.

### Requisições

Criação de pedidos com vários materiais ativos e quantidades positivas,
sem repetição do mesmo material. O setor do colaborador é registrado
no pedido. A criação não reserva nem desconta estoque.

A interface permite listar os pedidos e consultar seus detalhes,
incluindo as quantidades solicitadas e atendidas.

### Atendimento parcial e estoque

O atendimento registra a quantidade entregue de cada material,
atualiza o estoque e encerra o pedido como atendido, parcialmente
atendido ou não atendido.

A API verifica as quantidades solicitadas e disponíveis. Um material
sem estoque não impede a entrega dos demais. A gravação do atendimento
e da baixa ocorre em transação.

Pedidos encerrados não podem ser atendidos novamente.
As quantidades não entregues exigem uma nova requisição.

## Como executar

### Pré-requisitos

- SDK .NET 8.
- Node.js e npm compatíveis com as dependências do frontend.
- Git.

No ambiente de desenvolvimento foram utilizados Node.js 24.19.0
e npm 11.17.0.

### Backend

Na pasta principal do projeto, execute:

    dotnet tool restore
    dotnet restore
    dotnet tool run dotnet-ef database update
    dotnet run --launch-profile http

Mantenha o terminal aberto. A API utiliza normalmente:

    http://localhost:5053

O banco deve ser criado pelas migrations antes de iniciar a aplicação.
Os setores são cadastrados na inicialização quando ainda não existem.

### Frontend

Em outro terminal, entre na pasta frontend e execute:

    npm ci
    npm run dev

Abra o endereço exibido pelo Vite, normalmente:

    http://localhost:5173

A URL da API é configurada em frontend/.env.development.
Mantenha os dois terminais em execução.

### Banco local

Cada integrante utiliza seu próprio banco SQLite. Em uma instalação
nova, cadastre materiais e colaboradores pela interface antes de
criar requisições. Não presuma que os IDs serão iguais aos utilizados
nos testes anteriores.

## Verificações e testes

Para verificar o backend, na pasta principal:

    dotnet build

Para verificar o frontend, dentro de frontend:

    npm run build
    npm run lint

Foram realizados testes manuais de:

- Cadastro, consulta, edição e exclusão de materiais.
- Desativação de materiais e proteção de registros com histórico.
- Rejeição de nome vazio e estoque negativo pela API.
- Cadastro de colaboradores vinculados a setores.
- Rejeição de e-mail duplicado e setor inexistente.
- Criação, listagem e consulta de requisições.
- Atendimento parcial com baixa de estoque.
- Bloqueio de atendimento repetido.
- Persistência dos dados após atualizar a página.

No teste integrado pela interface, foram solicitadas três resmas de
papel e dois pacotes de copos. Foram entregues as três resmas; os copos
estavam sem estoque. O pedido ficou parcialmente atendido, o papel
passou de dez para sete resmas e os copos permaneceram com saldo zero.

O build e o lint do frontend foram executados sem erros.

## Colaboração

### Murilo dos Santos de Moraes

Participou da estrutura da API, modelagem, banco de dados, migrations,
setores, colaboradores, requisições e atendimento na primeira etapa.

Na segunda etapa, implementou as telas de materiais e cadastro de
colaboradores, ampliou a comunicação com a API e finalizou o visual
compartilhado. Também realizou testes e trabalhou na documentação.

### Leonardo Teles Pereira

Implementou o CRUD inicial de materiais na primeira etapa.

Na segunda etapa, preparou a base React, a integração com a API e
as telas de criação, listagem, detalhe e atendimento de requisições.

O histórico do GitHub registra as contribuições por meio de branches,
commits e pull requests.

## Uso de IA

O ChatGPT auxiliou no planejamento, nas explicações, na elaboração
e revisão de código, na interpretação de erros, nos testes e na
redação da documentação.

No acabamento visual, a solicitação foi harmonizar as três seções,
retirar os exemplos do Vite e adaptar o layout a diferentes larguras
de tela. A IA auxiliou na geração do CSS.

A equipe revisou formulários, navegação, tabelas, mensagens, cores,
contraste e adaptação do layout, além de executar testes de funcionamento,
build e lint. Informações adicionais do módulo de requisições estão
em frontend/README.md.

A aplicação não utiliza IA durante seu funcionamento.

## Limitações

- Não há login, autenticação ou autorização por perfil.
- Selecionar um colaborador identifica o solicitante, mas não
  comprova a identidade de quem opera a aplicação.
- O cadastro com senha em hash não representa um login implementado.
- Não há cancelamento, relatório de consumo ou identificação
  do gestor responsável pelo atendimento.
- O saldo pode ser alterado diretamente pela edição de materiais.

O sistema é destinado à demonstração acadêmica.

## Repositório

https://github.com/murilosantosmoraes23-gif/almoxarifado_hospitalar