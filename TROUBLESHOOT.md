# ABNT Formatter - Histórico de Problemas e Soluções

## Solução Atual: Processamento 100% no Browser

O backend foi removido. A formatação é feita inteiramente no browser usando:
- **mammoth** - extrair texto de DOCX
- **docx** - criar documento DOCX formatado

### Arquitetura Funcional

```
Usuário abre index.html ou localhost:5173
    ↓
Browser processa arquivo local
    ↓
mammoth extrai texto (DOCX) ou FileReader (TXT)
    ↓
JSZip cria DOCX manualmente com XML
    ↓
Download do arquivo
```

### Como Rodar

**Frontend React:**
```bash
cd abnt-formatter/frontend
npm install
npm run dev
```
Acessar: http://localhost:5173

**HTML Standalone (raiz do projeto):**
```bash
# Apenas abrir index.html no navegador
# Ou usar um servidor estático:
npx serve .
```

### Histórico de Problemas Resolvidos

1. ~~Conflito de módulos Node.js~~
2. ~~Express middleware com multer~~
3. ~~Falta de await~~
4. ~~CORS entre browser e API~~
5. ~~Response type no browser~~
6. ~~Base64 + JSON~~
7. ~~CORS blocking File://HTML → HTTP~~

### Lições Aprendidas

1. Processamento no browser elimina todos os problemas de backend/CORS
2. mammoth funciona diretamente no browser com arrayBuffer
3. docx tem build UMD para browser via CDN
4. Para casos com arquivos muito grandes, considerar web workers