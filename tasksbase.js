const config = require("./config.json")
const path = require("path")
const fs = require("fs")
const absoluteInputPath = path.resolve(config.inputPath)
const absoluteOutputPath = path.resolve(config.outputPath)
const tasks = []

fs.readFile("./tasks.json", "utf8", (error, data) => {
    if (!error) {
        for (var task of JSON.parse(data)) {
            tasks.push(task)
        }
    }
})

function createTask(type, filename) {
    const task = {
        id: crypto.randomUUID(),
        type: type,
        status: "waiting"
    }
    if (filename) {
        task.filename = filename
    }
    tasks.push(task)
    return task
}

function deleteTask(taskId) {
    const resultAbsolutePath = path.join(absoluteOutputPath, taskId.substring(0, 6).split("").join("/"))
    const absoluteOutputFilePath = path.join(resultAbsolutePath, taskId)
    if (fs.existsSync(absoluteOutputFilePath)) {
        fs.rmSync(absoluteOutputFilePath)
    }
    const matchingTask = getTaskById(taskId)
    if (matchingTask) {
        tasks.splice(tasks.indexOf(matchingTask), 1)
        saveTasks()
    }
}

function deleteTaskInputFile(taskId) {
    const matchingTask = tasks.find(task => task.id === taskId)
    const absoluteInputFilename = path.join(absoluteInputPath, matchingTask.filename)
    if (fs.existsSync(absoluteInputFilename)) {
        fs.rmSync(absoluteInputFilename)
    }
}

function doesInputFileExist(filename) {
    const absoluteFilename = path.join(absoluteInputPath, filename)
    return fs.existsSync(absoluteFilename)
}

function getTaskById(taskId) {
    return tasks.find(task => task.id === taskId)
}

function getTaskResult(taskId) {
    const resultAbsolutePath = path.join(absoluteOutputPath, taskId.substring(0, 6).split("").join("/"))
    const absoluteOutputFilePath = path.join(resultAbsolutePath, taskId)
    if (!fs.existsSync(absoluteOutputFilePath)) {
        return undefined
    } else {
        const data = fs.readFileSync(absoluteOutputFilePath, "utf8")
        if (!data) {
            return undefined
        } else {
            return JSON.parse(data)
        }
    }
}

function getTasks() {
    return tasks
}

function reportTaskCompletion(req, res) {
    const id = req.params.id
    const matchingTask = getTaskById(id)
    if (!matchingTask) {
        res.status(400).send({ error: "TaskNotFound" })
        return
    } else {
        saveTaskResult(id, req.body)
        deleteTaskInputFile(id)
        saveTasks()
        res.sendStatus(200)
    }
}

function saveTaskResult(taskId, result) {
    const resultAbsolutePath = path.join(absoluteOutputPath, taskId.substring(0, 6).split("").join("/"))
    fs.mkdirSync(resultAbsolutePath, { recursive: true})
    const absoluteOutputFilePath = path.join(resultAbsolutePath, taskId)
    const matchingTask = tasks.find(task => task.id === taskId)
    matchingTask.result = result
    matchingTask.completedat = new Date().toISOString()
    matchingTask.status = "done"
    fs.writeFileSync(absoluteOutputFilePath, JSON.stringify(matchingTask, null, 2), "utf8")
    delete matchingTask.result // Save memory in tasks.json
}

function saveTasks() {
    fs.writeFileSync("./tasks.json", JSON.stringify(tasks, null, 2), "utf8");
}

module.exports = { 
    createTask, 
    deleteTask,
    deleteTaskInputFile,
    doesInputFileExist, 
    getTaskById, 
    getTaskResult, 
    getTasks,
    reportTaskCompletion,
    saveTaskResult,
    saveTasks
}