param(
    [string]$Token = $env:GITHUB_TOKEN,
    [string]$Owner = "phdev13",
    [string]$Repo = "phteste113",
    [string]$Branch = "main",
    [string]$Message = "chore: prepare project for Render.com deployment"
)

if (-not $Token) {
    Write-Host "❌ Erro: Token do GitHub não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Como usar:" -ForegroundColor Yellow
    Write-Host "  1. Gere um token em: https://github.com/settings/tokens/new" -ForegroundColor Cyan
    Write-Host "  2. Execute:" -ForegroundColor Cyan
    Write-Host "     `$env:GITHUB_TOKEN = 'seu_token_aqui'" -ForegroundColor Green
    Write-Host "     .\push-commit.ps1" -ForegroundColor Green
    Write-Host ""
    exit 1
}

try {
    $headers = @{
        "Authorization" = "token $Token"
        "Accept" = "application/vnd.github.v3+json"
        "Content-Type" = "application/json"
    }
    
    Write-Host ""
    Write-Host "🚀 Enviando commit via GitHub API" -ForegroundColor Green
    Write-Host "Repository: $Owner/$Repo" -ForegroundColor Cyan
    Write-Host "Branch: $Branch" -ForegroundColor Cyan
    Write-Host ""
    
    # Obter referência da branch
    Write-Host "📍 Obtendo referência da branch..." -ForegroundColor Cyan
    $refUrl = "https://api.github.com/repos/$Owner/$Repo/git/refs/heads/$Branch"
    $ref = Invoke-RestMethod -Uri $refUrl -Headers $headers -ErrorAction Stop
    $currentSha = $ref.object.sha
    Write-Host "✓ SHA atual: $currentSha" -ForegroundColor Green
    
    # Obter commit para pegar tree
    Write-Host "🌳 Obtendo tree do commit..." -ForegroundColor Cyan
    $commitUrl = "https://api.github.com/repos/$Owner/$Repo/git/commits/$currentSha"
    $commit = Invoke-RestMethod -Uri $commitUrl -Headers $headers -ErrorAction Stop
    $treeSha = $commit.tree.sha
    Write-Host "✓ Tree SHA: $treeSha" -ForegroundColor Green
    
    # Criar novo commit
    Write-Host "✏️  Criando novo commit..." -ForegroundColor Cyan
    $now = (Get-Date -AsUTC -Format "yyyy-MM-ddTHH:mm:ssZ")
    
    $commitBody = @{
        message = $Message
        tree = $treeSha
        parents = @($currentSha)
        author = @{
            name = "PH Dev"
            email = "dev@phteste.com"
            date = $now
        }
        committer = @{
            name = "PH Dev"
            email = "dev@phteste.com"
            date = $now
        }
    } | ConvertTo-Json -Depth 10
    
    $createUrl = "https://api.github.com/repos/$Owner/$Repo/git/commits"
    $newCommit = Invoke-RestMethod -Uri $createUrl -Method POST -Headers $headers -Body $commitBody -ErrorAction Stop
    $newSha = $newCommit.sha
    Write-Host "✓ Novo commit: $newSha" -ForegroundColor Green
    
    # Atualizar referência
    Write-Host "🔄 Atualizando branch..." -ForegroundColor Cyan
    $updateBody = @{
        sha = $newSha
        force = $false
    } | ConvertTo-Json
    
    $updateUrl = "https://api.github.com/repos/$Owner/$Repo/git/refs/heads/$Branch"
    Invoke-RestMethod -Uri $updateUrl -Method PATCH -Headers $headers -Body $updateBody -ErrorAction Stop | Out-Null
    Write-Host "✓ Branch atualizada!" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "✅ Commit enviado com sucesso!" -ForegroundColor Green
    Write-Host "SHA: $newSha" -ForegroundColor Yellow
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "❌ Erro ao fazer commit:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    exit 1
}
