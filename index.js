import express from 'express'
import bcrypt from 'bcrypt';
const app = express()
app.use(express.json())

let accounts = [] 

function emailExiste(email) {
  return accounts.some((user) => user.email === email);
}

app.post('/createAccount', (req, res) => {
  const id = accounts.length + 1;
  const { name, email, password, recados } = req.body;

  if (!email || !password) {
    res.status(400).send('Email and password are required!');
    return;
  }

  if (emailExiste(email)) {
    res.status(400).send('The email already exists!');
    return;
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      res.status(500).send('Error creating account!');
      return;
    }

    const newAccount = { id, name, email, password: hashedPassword, recados };
    accounts.push(newAccount);

    res.status(201).send(`The email ${newAccount.email} has been successfully added!`);
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send('Email and password are required!');
    return;
  }

  const user = accounts.find((u) => u.email === email);

  if (!user) {
    res.status(401).send('Invalid data!');
    return;
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      res.status(401).send('Invalid data!');
      return;
    }

    // Senha válida, continuar com o processo de login
    res.status(200).send('Login successful!');
  });
});

app.get("/showUser", (req, res) => {
    res.status(200).json(accounts)
})

app.post('/user/:id/recados', (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, descricao } = req.body;

  const usuario = accounts.find((u) => u.id === id);

  if (!usuario) {
    res.status(404).send('User not found!');
    return;
  }

  if (!titulo || !descricao) {
    res.status(400).send('Title and description are required!');
    return;
  }

  const novoId = usuario.recados.length + 1;
  const novoRecado = { id: novoId, titulo, descricao };
  usuario.recados.push(novoRecado);

  res.status(201).send(`The message with title "${novoRecado.titulo}" was added to the user list.`);
});
  
app.get('/usuarios/:id/recados', (req, res) => {
  const id = parseInt(req.params.id);

  const usuario = accounts.find((u) => u.id === id);

  if (!usuario) {  
    res.status(404).send('User not found!');
    return;
  }

  res.send(usuario.recados);
});

app.put('/usuarios/:id/recados/:recadoId', (req, res) => {
  const userId = parseInt(req.params.id);
  const recadoId = parseInt(req.params.recadoId);
  const { titulo, descricao } = req.body;

  const usuario = accounts.find((u) => u.id === userId);

  if (!usuario) {
    res.status(404).send('User Message not found!');
    return;
  }

  const recado = usuario.recados.find((r) => r.id === recadoId);

  if (!recado) {
    res.status(404).send('Message not found!');
    return;
  }

  recado.titulo = titulo;
  recado.descricao = descricao;

  res.status(200).send(`The message with ID ${recadoId} was successfully updated!`);
});

