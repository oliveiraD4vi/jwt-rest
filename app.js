const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv/config');

const app = express();

const { eAdmin } = require('./middlewares/auth');
const db = require('./models/db');

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

  if (!(await bcrypt.compare(req.body.password, '$2a$08$vfD/XSvcSvmN0vsbdL5LeOAElQ7lSWv9bMKAORcl.QqdZOQ3gg2rK'))) {
    return res.status(400).json({
      error: true,
      message: 'Invalid user or ppassword!'
    });
  }

  var token = jwt.sign({id: 1}, process.env.JWT_KEY, {
    expiresIn: 60
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
