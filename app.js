const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

const { eAdmin } = require('./middlewares/auth');

app.use(express.json());

app.get('/', eAdmin, async (req, res) => {
  return res.json({
    error: false,
    message: 'List users'
  });
});

app.post('/register', async (req, res) => {
  const password = await bcrypt.hash('123456', 8);
  console.log(password);

  return res.json({
    error: false,
    message: 'User successfully registered!'
  });
});

app.post('/login', async (req, res) => {
  if (req.body.user != 'usuario@email.com') {
    return res.status(400).json({
      error: true,
      message: 'Invalid uuser or password!'
    });
  }

  if (!(await bcrypt.compare(req.body.password, '$2a$08$hdI4Vl/NKfeKkuQfaIfsIe7DkbkTAe5N.gHIOLXsPRIJ2wH2xVuFu'))) {
    return res.status(400).json({
      error: true,
      message: 'Invalid user or ppassword!'
    });
  }

  var token = jwt.sign({id: 1}, 'SASDERFGHNB44SASE54F1G5DFG2', {
    expiresIn: 60 // 60 segundos
  });

  return res.json({
    error: false,
    message: 'Logged successfully!',
    token
  });
});

app.listen(8080, () => {
  console.log("Servidor iniciado corretamente em http://localhost:8080");
});
