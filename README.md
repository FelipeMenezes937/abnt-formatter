# Formatador ABNT

Formate seus documentos automaticamente para o padrão ABNT diretamente no navegador.

## Sobre

Sistema de formatação de documentos que aplica as normas ABNT (NBR 14724) sem necessidade de servidor. Todo o processamento ocorre no browser, garantindo velocidade, privacidade e simplicidade de uso.

## Estrutura do Projeto

```
abnt-formatter/
├── index.html        Aplicação standalone em HTML puro
├── frontend/         React + Vite
│   └── src/
│       ├── App.jsx   Componente principal
│       └── App.css   Estilos
└── *.docx            Arquivos de exemplo
```

## Regras Aplicadas

| Elemento | Especificação |
|----------|---------------|
| Fonte | Times New Roman 12pt |
| Espaçamento | 1,5 entre linhas |
| Margem superior | 3cm |
| Margem esquerda | 3cm |
| Margem inferior | 2cm |
| Margem direita | 2cm |
| Alinhamento | Justificado |
| Recuo | 1,25cm (primeira linha) |

## Como Usar

### Opção 1: Aplicação Standalone

A forma mais rápida de usar:

```bash
# Abra diretamente no navegador
open index.html

# Ou sirva com servidor HTTP
npx serve .
```

### Opção 2: Frontend React

Para desenvolvimento ou customização:

```bash
cd frontend
npm install
npm run dev
```

Acesse: `http://localhost:5173`

## Tecnologias

- **mammoth** - Extração de texto de arquivos DOCX
- **jszip** - Geração de arquivos DOCX (ZIP com XML)
- **React** - Interface do usuário
- **Vite** - Build e servidor de desenvolvimento

## Funcionamento

1. O arquivo enviado (`.docx` ou `.txt`) é lido no navegador
2. O texto é extraído usando mammoth (para DOCX) ou FileReader (para TXT)
3. Um novo arquivo DOCX é gerado com a formatação ABNT especificada
4. O documento formatado é disponibilizado para download

## Limitações

- Imagens e tabelas não são preservadas (apenas texto)
- Formatação avançada (negrito, itálico) não é mantida
- Arquivos muito grandes podem travar o navegador

## Compatibilidade

Funciona em todos os navegadores modernos:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
