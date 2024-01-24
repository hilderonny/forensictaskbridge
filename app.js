const port = process.env.PORT

const config = require("./config.json")

const express = require("express")
const app = express()

app.use(express.static("public"))

app.use('/api/configuration', require('./api/configuration'))

app.listen(port, () => {
    console.log(`Forensic task bridge listening on port ${port}`)
})