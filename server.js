const express = require('express')

const DbRouter = require('./data/db-router.js')

server = express()

server.use(express.json())
server.use('/api/posts', DbRouter)

server.get('/', (req, res) => {
    res.send('<h2>posts<h2>')
})

module.exports = server