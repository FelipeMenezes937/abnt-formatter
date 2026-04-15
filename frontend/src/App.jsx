import { useState } from 'react'
import './App.css'

function App() {
  const [arquivo, setArquivo] = useState(null)
  const [processando, setProcessando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [downloadUrl, setDownloadUrl] = useState(null)

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

  const formatarDocumento = () => {
    if (!arquivo) return

    setProcessando(true)
    setMensagem('Processando...')

    const formData = new FormData()
    formData.append('arquivo', arquivo)

    fetch('http://localhost:3001/formatar', {
      method: 'POST',
      body: formData,
    })
    .then(res => {
      if (!res.ok) throw new Error('Erro: ' + res.status)
      return res.arrayBuffer()
    })
    .then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      setMensagem('Sucesso!')
    })
    .catch(erro => {
      setMensagem(erro.message)
    })
    .finally(() => setProcessando(false))
  }

  return (
    <div className="container">
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