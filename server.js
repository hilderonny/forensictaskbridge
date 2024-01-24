const port = process.env.PORT
const app = require("./app")

app.listen(port, () => {
    console.log(`Forensic task bridge listening on port ${port}`)
});