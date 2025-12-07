# Como fazer commit via API do GitHub

## Opção 1: Gerar Personal Access Token (Recomendado)

1. Acesse: https://github.com/settings/tokens/new
2. Configure as permissões:
   - ✅ repo (acesso completo ao repositório)
   - ✅ workflow (se necessário)
3. Clique em "Generate token"
4. Copie o token gerado

## Opção 2: Usar com Powershell

### Passo 1: Configurar o token como variável de ambiente

```powershell
$env:GITHUB_TOKEN = "seu_token_aqui"
```

### Passo 2: Executar o script de commit

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\commit-via-api.ps1
```

### Passo 3: Ou fazer commit manual via curl

```powershell
# Defina estas variáveis
$token = "seu_token_aqui"
$owner = "phdev13"
$repo = "phteste113"
$branch = "main"

# Obter o SHA do commit atual
$refUrl = "https://api.github.com/repos/$owner/$repo/git/refs/heads/$branch"
$headers = @{"Authorization" = "token $token"; "Accept" = "application/vnd.github.v3+json"}
$ref = Invoke-RestMethod -Uri $refUrl -Headers $headers
$currentSha = $ref.object.sha

# Criar novo commit
$commitUrl = "https://api.github.com/repos/$owner/$repo/git/commits/$currentSha"
$commit = Invoke-RestMethod -Uri $commitUrl -Headers $headers
$treeSha = $commit.tree.sha

$newCommitBody = @{
    message = "chore: prepare project for Render.com deployment"
    tree = $treeSha
    parents = @($currentSha)
    author = @{
        name = "PH Dev"
        email = "dev@phteste.com"
        date = (Get-Date -AsUTC -Format "o")
    }
} | ConvertTo-Json

$createUrl = "https://api.github.com/repos/$owner/$repo/git/commits"
$newCommit = Invoke-RestMethod -Uri $createUrl -Method POST -Headers $headers -Body $newCommitBody -ContentType "application/json"
$newSha = $newCommit.sha

# Atualizar a referência da branch
$updateBody = @{
    sha = $newSha
    force = $false
} | ConvertTo-Json

$updateUrl = "https://api.github.com/repos/$owner/$repo/git/refs/heads/$branch"
Invoke-RestMethod -Uri $updateUrl -Method PATCH -Headers $headers -Body $updateBody -ContentType "application/json"

Write-Host "✅ Commit enviado: $newSha"
```

## Onde Obter Personal Access Token?

1. Entre em sua conta GitHub
2. Vá para Settings → Developer settings → Personal access tokens → Tokens (classic)
3. Click em "Generate new token (classic)"
4. Dê um nome (ex: "Render Deploy")
5. Selecione "repo" (acesso completo)
6. Clique em "Generate token"
7. **Copie e guarde em um local seguro** (você não poderá ver depois)

## Segurança

⚠️ **Nunca commit seu token no repositório!**
- Guarde em arquivo `.env` local
- Use variáveis de ambiente
- Regenere se expor acidentalmente
