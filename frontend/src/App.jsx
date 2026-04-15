import { useState, useEffect, useRef } from 'react'
import mammoth from 'mammoth'
import JSZip from 'jszip'
import './App.css'

const FileIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>
)

const UploadIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
)

const CheckIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
)

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
)

const ListIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
)

function App() {
  const [arquivo, setArquivo] = useState(null)
  const [processando, setProcessando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  const fileInputRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    document.body.classList.toggle('dark', darkMode)
  }, [darkMode])

  const handleArquivo = (e) => {
    const file = e.target.files[0]
    if (file) processarFile(file)
  }

  const processarFile = (file) => {
    const ext = file.name.split('.').pop().toLowerCase()
    if (ext === 'docx' || ext === 'txt') {
      setArquivo(file)
      setMensagem('')
      setDownloadUrl(null)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processarFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const criarDocxAbnt = async (linhas) => {
    const zip = new JSZip()
    
    const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`

    const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`

    const documentRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`

    const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:qFormat/>
  </w:style>
</w:styles>`

    const paragraphsXml = linhas.map(linha => {
      const escapedText = linha
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      return `<w:p>
        <w:pPr>
          <w:jc w:val="both"/>
          <w:ind w:firstLine="1250"/>
          <w:spacing w:line="360" w:lineRule="auto"/>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
            <w:sz w:val="24"/>
          </w:rPr>
          <w:t>${escapedText}</w:t>
        </w:r>
      </w:p>`
    }).join('')

    const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1701" w:right="1134" w:bottom="1134" w:left="1701" w:header="708" w:footer="708" w:gutter="0"/>
    </w:sectPr>
    ${paragraphsXml}
  </w:body>
</w:document>`

    zip.file('[Content_Types].xml', contentTypes)
    zip.file('_rels/.rels', rels)
    zip.file('word/_rels/document.xml.rels', documentRels)
    zip.file('word/document.xml', document)
    zip.file('word/styles.xml', styles)

    return await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
  }

  const formatarDocumento = async () => {
    if (!arquivo) return

    setProcessando(true)
    setMensagem('')

    try {
      let texto = ''
      const ext = arquivo.name.split('.').pop().toLowerCase()

      if (ext === 'docx') {
        const arrayBuffer = await arquivo.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        texto = result.value
      } else {
        texto = await arquivo.text()
      }

      const linhas = texto.split('\n').filter(l => l.trim())

      if (linhas.length === 0) {
        linhas.push('')
      }

      const blob = await criarDocxAbnt(linhas)
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      setMensagem('sucesso')
    } catch (erro) {
      setMensagem('erro: ' + erro.message)
    } finally {
      setProcessando(false)
    }
  }

  return (
    <div className="container">
      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} title="Modo noturno">
        {darkMode ? '☀️' : '🌙'}
      </button>

      <div className="header">
        <div className="header-icon">
          <FileIcon />
        </div>
        <h1>Formatador ABNT</h1>
        <p className="subtitulo">Formate seus documentos para o padrão ABNT em segundos</p>
      </div>

      <div className="divider" />

      <div 
        className={`upload-area ${isDragOver ? 'dragover' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="file-input"
          accept=".docx,.txt" 
          onChange={handleArquivo} 
          disabled={processando} 
        />
        <div className="upload-icon">
          <UploadIcon />
        </div>
        <p className="upload-text">
          <span>Clique para selecionar</span> ou arraste o arquivo
        </p>
        <p className="upload-hint">Suporta arquivos .docx e .txt</p>
        {arquivo && <span className="file-name">{arquivo.name}</span>}
      </div>

      <button onClick={formatarDocumento} disabled={!arquivo || processando} className="btn-formatar">
        {processando ? (
          <>
            <div className="spinner" />
            Processando...
          </>
        ) : (
          <>
            <CheckIcon />
            Formatar Documento
          </>
        )}
      </button>

      {mensagem && (
        <p className={`mensagem ${mensagem.includes('sucesso') ? 'sucesso' : 'erro'}`}>
          {mensagem.includes('sucesso') ? '✓ Documento formatado com sucesso!' : mensagem}
        </p>
      )}

      {downloadUrl && (
        <a href={downloadUrl} download="documento_abnt.docx" className="btn-download">
          <DownloadIcon />
          Download
        </a>
      )}

      <div className="regras">
        <div className="regras-header">
          <ListIcon />
          <h3>Normas aplicadas</h3>
        </div>
        <ul>
          <li>Times New Roman 12</li>
          <li>Espaçamento 1,5</li>
          <li>Margens 3/2 cm</li>
          <li>Justificado</li>
        </ul>
      </div>
    </div>
  )
}

export default App
