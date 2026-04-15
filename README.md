# Formatador ABNT

Sistema que formata documentos automaticamente para o padrão ABNT. **Processamento 100% no browser** - sem backend.

## Estrutura

```
abnt-formatter/
├── index.html        # Versão standalone (HTML puro)
├── frontend/         # React (Vite)
│   ├── src/
│   └── package.json
├── TROUBLESHOOT.md
└── *.docx            # Arquivos de teste
```

## Regras ABNT Aplicadas

- Fonte: Times New Roman, tamanho 12
- Espaçamento: 1,5 linhas
- Margens: superior/esquerda 3cm, inferior/direita 2cm
- Alinhamento: justificado
- Recuo: 1,25cm (primeira linha)

## Como Rodar

### Opção 1: HTML Standalone
```bash
# Apenas abra index.html no navegador
# Ou use um servidor estático:
npx serve .
```

### Opção 2: Frontend React
```bash
cd frontend
npm install
npm run dev
```
Acessar: http://localhost:5173

## Tecnologias

- **Frontend**: React, Vite, mammoth, jszip
- Processamento local (sem servidor)
- DOCX criado manualmente com XML (via jszip)