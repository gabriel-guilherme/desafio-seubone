require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');


const app = express()
app.use(express.json())
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));

const authRoutes = require('./routes/auth')
app.use('/auth', authRoutes)

const recorteRoutes = require('./routes/recortes')
app.use('/recortes', recorteRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
