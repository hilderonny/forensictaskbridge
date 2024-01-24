const port = process.env.PORT

const express = require("express")
const app = express()

app.use(express.static("public"))

app.listen(port, () => {
    console.log(`Forensic task bridge listening on port ${port}`)
})