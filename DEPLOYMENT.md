# Deployment no Render.com

## Configuração Automática

Este projeto está configurado para fazer deploy automático no Render.com através do arquivo `render.yaml`.

### Pré-requisitos

1. Conta no [Render.com](https://render.com)
2. Repositório no GitHub
3. Variável de ambiente `GEMINI_API_KEY`

### Passos para Deploy

1. **Conectar GitHub ao Render**
   - Acesse [https://dashboard.render.com](https://dashboard.render.com)
   - Clique em "New +"
   - Selecione "Web Service"
   - Conecte seu repositório GitHub

2. **Configurar Variáveis de Ambiente**
   - No dashboard do Render, vá para "Environment"
   - Adicione a variável `GEMINI_API_KEY` com sua chave da API do Google Gemini

3. **Deploy Automático**
   - Cada push para a branch `main` fará deploy automático
   - O Render executará `npm install && npm run build`
   - O servidor iniciará com `npm run preview`

### Variáveis de Ambiente Necessárias

- `GEMINI_API_KEY`: Sua chave de API do Google Gemini

### Monitoramento

- Acesse o dashboard do Render para ver logs
- Cada push ao GitHub dispara um novo build

### Scripts Disponíveis

- `npm run dev` - Desenvolvimento local
- `npm run build` - Build de produção
- `npm run preview` - Servir build localmente
- `npm run start` - Build + Serve (usado no Render)
- `npm run serve` - Serve com host 0.0.0.0 (deployment)

### Troubleshooting

Se o deploy falhar:
1. Verifique os logs no dashboard do Render
2. Confirme que `GEMINI_API_KEY` está configurada
3. Certifique-se de que o `package.json` está válido
4. Teste localmente: `npm install && npm run build && npm run preview`
