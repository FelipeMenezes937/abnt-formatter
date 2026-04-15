import { useState, useEffect } from 'react'
import mammoth from 'mammoth'
import JSZip from 'jszip'
import './App.css'

function App() {
  const [arquivo, setArquivo] = useState(null)
  const [processando, setProcessando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [downloadUrl, setDownloadUrl] = useState(null)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    document.body.classList.toggle('dark', darkMode)
  }, [darkMode])

  const handleArquivo = (e) => {
    const file = e.target.files[0]
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase()
      if (ext === 'docx' || ext === 'txt') {
        setArquivo(file)
        setMensagem('')
        setDownloadUrl(null)
      } else {
        setArquivo(null)
        setMensagem('Tipo inválido')
      }
    }
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
    setMensagem('Processando...')

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
      setMensagem('Sucesso!')
    } catch (erro) {
      setMensagem('Erro: ' + erro.message)
    } finally {
      setProcessando(false)
    }
  }

  return (
    <div className="container">
      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} title="Modo noturno">
        {darkMode ? '☀️' : '🌙'}
      </button>
      <h1>Formatador ABNT</h1>
      <p className="subtitulo">Transforme documento para padrão ABNT</p>

      <div className="upload-area">
        <input type="file" accept=".docx,.txt" onChange={handleArquivo} disabled={processando} />
        {arquivo && <p className="file-name">{arquivo.name}</p>}
      </div>

      <button onClick={formatarDocumento} disabled={!arquivo || processando} className="btn-formatar">
        {processando ? 'Processando...' : 'Formatar Documento'}
      </button>

      {mensagem && <p className={mensagem.includes('Sucesso') ? 'sucesso' : 'erro'}>{mensagem}</p>}

      {downloadUrl && (
        <a href={downloadUrl} download="documento_abnt.docx" className="btn-download">Download</a>
      )}

      <div className="regras">
        <h3>Regras aplicadas:</h3>
        <ul>
          <li>Times New Roman 12</li>
          <li>Espaçamento 1,5</li>
          <li>Margens 3/2cm</li>
          <li>Justificado</li>
        </ul>
      </div>
    </div>
  )
}

export default App