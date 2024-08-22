require('dotenv').config()
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const { Server } = require('socket.io')
const apiRouter = require('./routes/routes')

const app = express();

const server = http.createServer(app)

exports.io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
})

require('./services/socket.services');

app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
app.use(cors())
app.use(morgan('dev'))

app.use(express.json());

mongoose.connect(process.env.DATABASE_URL)
        .then(() => console.log('Mongoose connected to ' + process.env.DATABASE_URL))
        .catch((e) => console.error('Mongoose connection error: ' + e))
        
app.use('/api', apiRouter)

app.use("*", (req, res) => {
    res.status(404).send("404 Error")
})

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})