const express = require('express');
const app = express();
const db = require('./database');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rota para exibir a página de início
app.get('/', (req, res) => {
  res.render('index');
});

// Rota para exibir mensagens
app.get('/messages', (req, res) => {
  db.all('SELECT * FROM messages', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar mensagens' });
    }
    res.render('messages.ejs', { messages: rows });
  });
});

// Rota para editar mensagem
app.get('/edit/:id', (req, res) => {
  const messageId = req.params.id;
  db.get('SELECT * FROM messages WHERE id = ?', [messageId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar mensagem' });
    }
    res.render('edit.ejs', { message: row });
  });
});

app.post('/edit/:id', (req, res) => {
  const messageId = req.params.id;
  const updatedContent = req.body.content;
  db.run('UPDATE messages SET content = ? WHERE id = ?', [updatedContent, messageId], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar mensagem' });
    }
    res.redirect('/messages');
  });
});

// Rota para excluir mensagem
app.get('/delete/:id', (req, res) => {
  const messageId = req.params.id;
  db.run('DELETE FROM messages WHERE id = ?', [messageId], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao excluir mensagem' });
    }
    res.redirect('/messages');
  });
});

// Rota para enviar mensagem
app.post('/send', (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.redirect('/messages');
  }

  db.run('INSERT INTO messages (content) VALUES (?)', [content], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao enviar mensagem' });
    }
    res.redirect('/messages');
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
