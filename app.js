const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv/config');

const app = express();

const { eAdmin } = require('./middlewares/auth');
const db = require('./models/db');
const User = require('./models/User');

app.use(express.json());

app.get('/', eAdmin, async (req, res) => {
  await User.findAll({
    attributes: ['id', 'name', 'user'],
    order: [['id', "DESC"]]
  })
  .then((users) => {
    return res.json({
      error: false,
      users,
      id_logged_user: req.userId
    });
  }).catch(() => {
    return res.status(400).json({
      error: true,
      message: "Erro: Nenhum usuário encontrado!"
    });
  });
});

app.post('/register', async (req, res) => {
  const dados = req.body;
  dados.password = await bcrypt.hash(dados.password, 8);

  await User.create(dados);

  return res.json({
    error: false,
    message: 'User successfully registered!'
  });
});

app.post('/login', async (req, res) => {
  const user = await User.findOne({
    attributes: ['id', 'name', 'user', 'password'],
    where: {
      user: req.body.user
    }
  });

  if(user === null){
    return res.status(400).json({
      error: true,
      message: "Inavlid user or password!"
    });
  }

  if(!(await bcrypt.compare(req.body.password, user.password))){
    return res.status(400).json({
      error: true,
      message: "Inavlid user or password!"
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
