# Como executar o almoxarifado hospitalar

O projeto usa .NET 8 no backend e React com Vite no frontend. Para executar no Windows, instale o SDK do .NET 8 e o Node.js com npm.

## 1. Iniciar a API

Abra o PowerShell na pasta principal do projeto, onde está o arquivo Program.cs. Execute um comando por vez:

```powershell
dotnet tool restore
dotnet ef database update
dotnet run --launch-profile http
```

Deixe esse terminal aberto. Para conferir se a API está funcionando, abra http://localhost:5053/setores no navegador. Deve aparecer a lista de setores.

## 2. Iniciar o frontend

Abra um segundo PowerShell na pasta principal do projeto e execute:

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev
```

Deixe o segundo terminal aberto e acesse http://localhost:5173 no navegador. Use o menu para alternar entre Materiais, Colaboradores e Requisições.

## 3. Verificar o frontend

Em um terminal dentro da pasta frontend, execute:

```powershell
npm.cmd run build
npm.cmd run lint
```

## Uso de IA no CSS

- **Trecho da solicitação original:** “Gerar o CSS com auxílio de IA e registrar ferramenta, prompt e ajustes.”
- **Aplicação:** o CSS foi adicionado ao `src/App.css`. A classe `area-requisicoes` foi aplicada à seção de Requisições em `src/App.jsx` para limitar o estilo ao módulo.
- **Ajustes:** o campo de quantidade recebeu uma largura menor que os seletores. Os campos e botões receberam um contorno visível para navegação pelo teclado.

## Testes do módulo de requisições

| Teste | Resultado observado |
| --- | --- |
| Criar uma requisição | O pedido de 2 pacotes de gaze foi salvo com status `Pendente`. |
| Listar requisições | Um novo pedido apareceu na lista após o envio, sem atualizar a página. |
| Consultar detalhes | A tela mostrou o material, a quantidade solicitada e a quantidade atendida. |
| Atender parcialmente | Ao confirmar 1 dos 2 pacotes solicitados, o status mudou para `AtendidaParcialmente` e a quantidade atendida passou para 1. |
| Verificar o frontend | `npm.cmd run lint` terminou sem avisos ou erros e `npm.cmd run build` concluiu com sucesso. 