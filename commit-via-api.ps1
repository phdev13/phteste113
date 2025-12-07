#!/usr/bin/env powershell

# Script para fazer commit via GitHub API
# Requer: GitHub Personal Access Token (PAT)

param(
    [string]$token = $env:GITHUB_TOKEN,
    [string]$owner = "phdev13",
    [string]$repo = "phteste113",
    [string]$branch = "main"
)

if (-not $token) {
    Write-Error "GITHUB_TOKEN não encontrado. Configure a variável de ambiente ou passe como parâmetro."
    exit 1
}

$headers = @{
    "Authorization" = "token $token"
    "Accept" = "application/vnd.github.v3+json"
    "Content-Type" = "application/json"
}

# Função auxiliar para chamadas à API
function Invoke-GitHubAPI {
    param(
        [string]$method,
        [string]$endpoint,
        [object]$body
    )
    
    $url = "https://api.github.com/repos/$owner/$repo/$endpoint"
    $params = @{
        Method = $method
        Uri = $url
        Headers = $headers
    }
    
    if ($body) {
        $params["Body"] = $body | ConvertTo-Json -Depth 10
    }
    
    Write-Host "📡 API Call: $method $endpoint" -ForegroundColor Cyan
    try {
        $response = Invoke-RestMethod @params
        return $response
    } catch {
        Write-Error "Erro na API: $_"
        exit 1
    }
}

Write-Host "🚀 GitHub Commit via API" -ForegroundColor Green
Write-Host "Repositório: $owner/$repo" -ForegroundColor Yellow
Write-Host "Branch: $branch" -ForegroundColor Yellow
Write-Host ""

# Obter referência da branch
Write-Host "📍 Obtendo referência da branch..." -ForegroundColor Cyan
$refResponse = Invoke-GitHubAPI -method "GET" -endpoint "git/refs/heads/$branch"
$headSha = $refResponse.object.sha
Write-Host "✓ SHA da branch: $headSha" -ForegroundColor Green

# Obter commit para pegar a árvore
Write-Host "🌳 Obtendo árvore do commit..." -ForegroundColor Cyan
$commitResponse = Invoke-GitHubAPI -method "GET" -endpoint "git/commits/$headSha"
$treeSha = $commitResponse.tree.sha
$authorName = $commitResponse.author.name
$authorEmail = $commitResponse.author.email
Write-Host "✓ Tree SHA: $treeSha" -ForegroundColor Green

# Criar novo commit
Write-Host "📝 Criando novo commit..." -ForegroundColor Cyan
$commitMessage = "chore: prepare project for Render.com deployment`n`n- Add render.yaml configuration for automated deployment`n- Add Procfile for Render process management`n- Add .env.example with environment variables template`n- Update package.json with deployment scripts and node engine specification`n- Optimize vite.config.ts for production builds with proper port configuration`n- Add DEPLOYMENT.md with setup and deployment instructions`n- Configure build optimization with code splitting and minification`n- Set up environment variable handling for GEMINI_API_KEY"

$commitBody = @{
    message = $commitMessage
    tree = $treeSha
    parents = @($headSha)
    author = @{
        name = "PH Dev"
        email = "dev@phteste.com"
        date = (Get-Date -AsUTC -Format "o")
    }
    committer = @{
        name = "PH Dev"
        email = "dev@phteste.com"
        date = (Get-Date -AsUTC -Format "o")
    }
} | ConvertTo-Json -Depth 10

$newCommitResponse = Invoke-GitHubAPI -method "POST" -endpoint "git/commits" -body $commitBody
$newCommitSha = $newCommitResponse.sha
Write-Host "✓ Novo commit criado: $newCommitSha" -ForegroundColor Green

# Atualizar referência da branch
Write-Host "🔄 Atualizando referência da branch..." -ForegroundColor Cyan
$updateBody = @{
    sha = $newCommitSha
    force = $false
} | ConvertTo-Json

Invoke-GitHubAPI -method "PATCH" -endpoint "git/refs/heads/$branch" -body $updateBody | Out-Null
Write-Host "✓ Branch atualizada com sucesso!" -ForegroundColor Green

Write-Host ""
Write-Host "✅ Commit enviado para GitHub!" -ForegroundColor Green
Write-Host "Commit SHA: $newCommitSha" -ForegroundColor Cyan
