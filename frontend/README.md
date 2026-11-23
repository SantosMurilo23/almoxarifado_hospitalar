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