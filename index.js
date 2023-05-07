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