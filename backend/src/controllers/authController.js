const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const prisma = require('../lib/prisma')
const { generateToken } = require('../util/token')

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).send('Email e senha são obrigatórios')

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) return res.status(400).send('Email já cadastrado')

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })

    res.status(201).json({ id: user.id, email: user.email })
  } catch (error) {
    res.status(500).send('Erro ao registrar usuário' + error.message)
  }
  
  
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).send('Email e senha são obrigatórios')

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).send('Email ou senha inválidos')

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return res.status(401).send('Email ou senha inválidos')

    const token = generateToken(user)
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
    })

    res.send('Login realizado com sucesso')
  } catch (error) {
    res.status(500).send('Erro ao fazer login' + error.message)
  }
  
}

exports.logout = (req, res) => {
  res.clearCookie('token')
  res.send('Logout realizado com sucesso')
}

exports.checkAuth = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ authenticated: false, message: 'Token não fornecido.' });
  }

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({
      authenticated: true,
      user: { id: decodedUser.id, email: decodedUser.email }
    });

  } catch (err) {
    res.clearCookie('token');
    return res.status(403).json({ authenticated: false, error: 'Token inválido ou expirado.' });
  }
};