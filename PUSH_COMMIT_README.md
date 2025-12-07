# 🚀 Fazer Commit via API do GitHub

## ⚡ Quick Start (30 segundos)

### Passo 1: Gerar Token
1. Acesse: https://github.com/settings/tokens/new
2. Selecione apenas `repo`
3. Clique "Generate token"
4. **Copie o token** (você não verá novamente)

### Passo 2: Executar no PowerShell

```powershell
cd c:\Users\kayka\Desktop\ph

# Configure o token
$env:GITHUB_TOKEN = "seu_token_copiado_aqui"

# Execute o script
.\push-commit.ps1
```

## ✅ Pronto!

Seu commit foi enviado para o GitHub! 🎉

---

## 📋 Detalhes

### O que o script faz?

1. ✓ Conecta à API do GitHub
2. ✓ Obtém o último commit da branch `main`
3. ✓ Cria um novo commit com sua mensagem
4. ✓ Atualiza a branch para apontar para o novo commit

### Personalizando

```powershell
# Commit com mensagem customizada
.\push-commit.ps1 -Message "Minha mensagem aqui"

# Especificar token direto (menos seguro)
.\push-commit.ps1 -Token "seu_token" -Message "chore: deploy"
```

### Scripts Disponíveis

- **`push-commit.ps1`** - Script PowerShell (recomendado)
- **`commit-via-api.ps1`** - Versão estendida com logs detalhados
- **`commit-api.bat`** - Versão Batch (Windows)

---

## ⚠️ Segurança

✅ **Seguro:**
- Usar `$env:GITHUB_TOKEN` (variável de ambiente temporária)
- Tokens com escopo limitado (`repo` apenas)

❌ **NÃO SEGURO:**
- Deixar tokens em arquivos
- Commitar arquivos com tokens
- Usar tokens com múltiplas permissões

### Se o token vazar:

1. Vá para: https://github.com/settings/tokens
2. Clique em "Delete" no token comprometido
3. Gere um novo token

---

## 🔧 Troubleshooting

### "Token não reconhecido"
```powershell
# Verifique o token
$env:GITHUB_TOKEN

# Teste a autenticação
$headers = @{"Authorization" = "token $env:GITHUB_TOKEN"}
Invoke-RestMethod -Uri "https://api.github.com/user" -Headers $headers
```

### "Repository not found"
- Verifique se o repositório é público ou você tem acesso
- Confirme Owner e Repo estão corretos

### "Branch not found"
- Verifique se a branch `main` existe
- Tente com: `.\push-commit.ps1 -Branch "master"`

---

## 📚 Referência

- GitHub API Docs: https://docs.github.com/en/rest
- Personal Access Tokens: https://github.com/settings/tokens
