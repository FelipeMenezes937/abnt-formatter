# Formatador ABNT - MVP

Sistema que formata documentos automaticamente para o padrão ABNT.

## Estrutura

```
abnt-formatter/
├── backend/          # Servidor Node.js
│   ├── package.json
│   ├── server.js
│   └── uploads/      # Arquivos temporários
└── frontend/         # React (Vite)
    ├── src/
    └── package.json
```

## Regras ABNT Aplicadas

- Fonte: Times New Roman, tamanho 12
- Espaçamento: 1,5 linhas
- Margens: superior/esquerda 3cm, inferior/direita 2cm
- Alinhamento: justificado
- Recuo: 1,25cm (primeira linha)

## Como Rodar

### 1. Instalar dependências

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

### 2. Iniciar servidores

Terminal 1 (Backend):
```bash
cd backend
npm start
```
Servidor rodando em http://localhost:3001

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```
Frontend em http://localhost:5173

### 3. Usar

1. Abra http://localhost:5173
2. Faça upload de um arquivo .docx ou .txt
3. Clique em "Formatar Documento"
4. Faça download do arquivo formatado

## Tecnologias

- **Backend**: Node.js, Express, multer, mammoth, docx
- **Frontend**: React, Vite