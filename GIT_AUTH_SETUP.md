## 🔐 Autenticação Git - Como Fazer

### Opção 1: GitHub CLI (Recomendado - Mais Fácil)

```powershell
# Instalar GitHub CLI (se não tiver)
choco install gh -y
# ou
winget install GitHub.cli

# Fazer login
gh auth login

# Depois fazer push normalmente
git push -u origin main
```

### Opção 2: Personal Access Token (HTTPS)

1. **Criar token no GitHub:**
   - Acesse: https://github.com/settings/tokens/new
   - Selecione: `repo`, `write:packages`
   - Clique: "Generate token"
   - Copie o token

2. **No PowerShell:**
```powershell
cd c:\Users\kayka\Desktop\ph

# Configurar HTTPS
git remote set-url origin https://github.com/phdev13/phteste113.git

# Fazer push (será pedido usuário e senha)
git push -u origin main
# Usuário: phdev13
# Senha: cole o token aqui (não é visível, é normal)
```

3. **Ou configurar credenciais globalmente:**
```powershell
git config --global credential.helper wincred
git push -u origin main
```

### Opção 3: SSH Key (Mais Seguro Após Setup)

```powershell
# Gerar chave SSH (se não tiver)
ssh-keygen -t ed25519 -C "seu_email@gmail.com"
# Pressione Enter 3x para aceitar defaults

# Copiar chave pública
Get-Content $HOME\.ssh\id_ed25519.pub | Set-Clipboard

# Adicionar no GitHub:
# - Vá em: https://github.com/settings/keys
# - Clique "New SSH key"
# - Cole a chave
# - Clique "Add SSH key"

# Depois fazer push
git push -u origin main
```

---

## ✅ Comandos Prontos para Copiar e Colar

### Se escolher HTTPS com Token:

```powershell
# 1. Copie o token de https://github.com/settings/tokens/new
# 2. Execute esses comandos:

cd "c:\Users\kayka\Desktop\ph"
git remote set-url origin https://github.com/phdev13/phteste113.git
git push -u origin main

# Quando pedir senha, cole o token
```

### Se escolher GitHub CLI:

```powershell
# 1. Instale
winget install GitHub.cli

# 2. Faça login
gh auth login

# 3. Faça push
cd "c:\Users\kayka\Desktop\ph"
git push -u origin main
```

---

## 🤔 Qual Escolher?

| Método | Facilidade | Segurança | Recomendado |
|--------|-----------|----------|------------|
| **GitHub CLI** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ✅ Sim! |
| **HTTPS Token** | ⭐⭐⭐⭐ | ⭐⭐⭐ | Alternativa |
| **SSH Key** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Para depois |

**Recomendo: GitHub CLI** - Mais fácil e bem seguro! 🚀
