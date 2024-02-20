const express = require("express")

const app = express()

app.use(express.json({ limit: "50mb"}))

app.use(express.static("public"))

app.use('/api/configuration', require('./api/configuration'))

app.use('/api/tasks', require('./api/tasks'))
app.use('/api/tasks/remove', require('./api/tasks/remove'))
app.use('/api/tasks/restart', require('./api/tasks/restart'))
app.use('/api/tasks/result', require('./api/tasks/result'))
app.use('/api/tasks/status', require('./api/tasks/status'))

app.use('/api/tasks/classifyimage/add', require('./api/tasks/classifyimage/add'))
app.use('/api/tasks/classifyimage/reportcompletion', require('./api/tasks/classifyimage/reportcompletion'))
app.use('/api/tasks/classifyimage/take', require('./api/tasks/classifyimage/take'))

app.use('/api/tasks/transcribe/add', require('./api/tasks/transcribe/add'))
app.use('/api/tasks/transcribe/reportcompletion', require('./api/tasks/transcribe/reportcompletion'))
app.use('/api/tasks/transcribe/take', require('./api/tasks/transcribe/take'))

app.use('/api/tasks/translate/add', require('./api/tasks/translate/add'))
app.use('/api/tasks/translate/reportcompletion', require('./api/tasks/translate/reportcompletion'))
app.use('/api/tasks/translate/take', require('./api/tasks/translate/take'))

app.use('/api/workers', require('./api/workers'))

module.exports = app