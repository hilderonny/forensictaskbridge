const express = require("express")

const app = express()

app.use(express.json())

app.use(express.static("public"))

app.use('/api/configuration', require('./api/configuration'))
app.use('/api/tasks', require('./api/tasks'))

module.exports = app