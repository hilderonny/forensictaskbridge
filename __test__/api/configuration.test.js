process.env.INPUTPATH = "./testdata/input"
process.env.OUTPUTPATH = "./testdata/input"


const fs = require("fs")
const path = require("path")
const request = require("supertest")
const app = require("../../app")

afterEach(() => {
    if (fs.existsSync("./testdata")) fs.rmdirSync("./testdata", { recursive: true, force: true })
})

describe("GET /api/configuration", () => {

    test("Should return HTTP 200", async () => {
        const response = await request(app).get("/api/configuration")
        expect(response.statusCode).toBe(200)
    })

    test("Should return correct structure", async () => {
        const response = await request(app).get("/api/configuration")
        expect(response.body).toHaveProperty("paths.input.path")
        expect(response.body).toHaveProperty("paths.input.exists")
        expect(response.body).toHaveProperty("paths.input.canread")
        expect(response.body).toHaveProperty("paths.input.canwrite")
        expect(response.body).toHaveProperty("paths.output.path")
        expect(response.body).toHaveProperty("paths.output.exists")
        expect(response.body).toHaveProperty("paths.output.canread")
        expect(response.body).toHaveProperty("paths.output.canwrite")
    })

    test("Should return input path", async () => {
        const expectedInputPath = path.resolve(testInputPath)
        const response = await request(app).get("/api/configuration")
        expect(response.body.paths.input.path).toBe(expectedInputPath)
    })

    test("Should report existing input path", async () => {
        fs.mkdirSync(testInputPath, { recursive: true })
        const response = await request(app).get("/api/configuration")
        expect(response.body.paths.input.exists).toBe(true)
    })

    test("Should report inexisting input path", async () => {
        const response = await request(app).get("/api/configuration")
        expect(response.body.paths.input.exists).toBe(false)
    })

    test("Should return output path", async () => {
        const expectedOutputPath = path.resolve(testOutputPath)
        const response = await request(app).get("/api/configuration")
        expect(response.body.paths.output.path).toBe(expectedOutputPath)
    })

    test("Should report existing output path", async () => {
        fs.mkdirSync(testOutputPath, { recursive: true })
        const response = await request(app).get("/api/configuration")
        expect(response.body.paths.output.exists).toBe(true)
    })

    test("Should report inexisting output path", async () => {
        const response = await request(app).get("/api/configuration")
        expect(response.body.paths.output.exists).toBe(false)
    })

})