const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, AlignmentType } = require('docx');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '30mb' }));

app.get('/health', (req, res) => res.json({ status: 'OK' }));

app.post('/formatar', async (req, res) => {
  try {
    const { arquivo, nome } = req.body;
    if (!arquivo) return res.status(400).json({ erro: 'Sem arquivo' });

    const buffer = Buffer.from(arquivo, 'base64');
    const ext = path.extname(nome || 'docx').toLowerCase();
    const inputPath = 'uploads/input' + ext;
    
    fs.writeFileSync(inputPath, buffer);

    let text = '';
    if (ext === '.docx') {
      const mammoth = require('mammoth');
      const result = await mammoth.extractRawText({ path: inputPath });
      text = result.value;
    } else {
      text = fs.readFileSync(inputPath, 'utf-8');
    }

    fs.unlinkSync(inputPath);

    const lines = text.split('\n').filter(l => l.trim());
    const children = lines.map(line => 
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        indent: { firstLine: 1.25 * 5670 },
        spacing: { line: 360 },
        children: [new TextRun({ text: line, font: 'Times New Roman', size: 24 })],
      })
    );

    if (children.length === 0) {
      children.push(new Paragraph({ children: [new TextRun({ text: '', font: 'Times New Roman', size: 24 })] }));
    }

    const doc = new Document({
      sections: [{
        properties: { page: { margin: { top: 3 * 5670, right: 2 * 5670, bottom: 2 * 5670, left: 3 * 5670 } } },
        children: children,
      }],
    });

    const outBuffer = await Packer.toBuffer(doc);
    const base64 = outBuffer.toString('base64');

    res.json({ arquivo: base64 });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Rodando em ' + PORT));