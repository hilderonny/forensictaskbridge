const config = require("../config.json")
const path = require("path")
const fs = require("fs")
const absoluteInputPath = path.resolve(config.inputPath)
const absoluteOutputPath = path.resolve(config.outputPath)
const crypto = require("crypto")
const tasks = []
const express = require("express")
const apiRouter = express.Router()

fs.readFile("./tasks.json", "utf8", (error, data) => {
    if (!error) {
        for (var task of JSON.parse(data)) {
            tasks.push(task)
        }
    }
})

function saveTasks() {
    fs.writeFileSync("./tasks.json", JSON.stringify(tasks, null, 2), "utf8");
}

/**
 * @api {get} /api/tasks Request all running tasks
 * @apiVersion 1.0.0
 * @apiGroup Clients
 * 
 * @apiSuccess {Object[]}   tasks                                       List of running tasks. Can be empty when no task is running.
 * @apiSuccess {String}     tasks.id                                    Unique ID of the task.
 * @apiSuccess {String}     tasks.type                                  Type of the task to run. Can be "transcribe", "translate" or "classifyimage"
 * @apiSuccess {String}     tasks.filename                              File name of the object to process within the input directory
 * @apiSuccess {Boolean}    tasks.inprogress                            "true" when the task is currently processed by a worker, "false" when not
 * @apiSuccess {Object}     tasks.properties                            Additional properties for specific tasks
 * @apiSuccess {String}     tasks.properties.transcribemodel            For task "transcribe": Defines the Whisper model to use. Can be "tiny", "base", "small", "medium" or "large-v2"
 * @apiSuccess {String}     tasks.properties.translatesourcelanguage    For task "translate": The source language of the text. E.g. "en"
 * @apiSuccess {String}     tasks.properties.translatetargetlanguage    For task "translate": The target language in which the text should be translated. E.g. "de"
 * @apiSuccess {String}     tasks.properties.classifyimagelanguage      For task "classifyimage": The target language of the image classification results. Can be "de" or "en".
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *         {
 *             "id": "950a0071-dfeb-40c5-9889-a45deb9e69f7",
 *             "type": "transcribe",
 *             "filename": "arabic_speec.ogg",
 *             "inprogress": true,
 *             "properties": {
 *                 "transcribemodel": "large-v2"
 *             }
 *         },
 *         {
 *             "id": "6e5da9d1-ff60-4a3f-a663-892dbb50f347",
 *             "type": "translate",
 *             "filename": "english_text.txt",
 *             "inprogress": true,
 *             "properties": {
 *                 "translatesourcelanguage": "en",
 *                 "translatetargetlanguage": "de"
 *             }
 *         },
 *         {
 *             "id": "bc7c1468-47da-46af-8155-beabe813535b",
 *             "type": "classifyimage",
 *             "filename": "apples.jpg",
 *             "inprogress": false,
 *             "properties": {
 *                 "classifyimagelanguage": "de"
 *             }
 *         }
 *     ]
 */
apiRouter.get('/', function(req, res) {
    res.json(tasks)
})

/**
 * @api {post} /api/tasks/addtranscribetask/:filename/:transcribemodel Add a transcribe task
 * @apiVersion 1.0.0
 * @apiGroup Clients
 * 
 * @apiParam {String}                                            filename            Name of the file to process. Must be located in the input folder
 * @apiParam {String="tiny","base","small","medium","large-v2"}  transcribemodel     Whisper model to use for transcription.
 * 
 * @apiSuccess {String} id                         Unique ID of the newly created transcription task.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "id": "950a0071-dfeb-40c5-9889-a45deb9e69f7"
 *     }
 * 
 * @apiError (400 Bad Request) FileNotFound There was no file in the input folder for the given <i>filename</i>
 * @apiError (400 Bad Request) ModelNotSupported The given <i>transcribemodel</i> is not supported
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "FileNotFound"
 *     }
 */
apiRouter.post('/addtranscribetask/:filename/:transcribemodel', function(req, res) {
    const filename = req.params.filename
    const absoluteFilename = path.join(absoluteInputPath, filename)
    if (!fs.existsSync(absoluteFilename)) {
        res.status(400).send({ error: "FileNotFound" })
        return
    }
    const transcribemodel = req.params.transcribemodel
    if (!["tiny","base","small","medium","large-v2"].includes(transcribemodel)) {
        res.status(400).send({ error: "ModelNotSupported" })
        return
    }
    const task = {
        id: crypto.randomUUID(),
        type: "transcribe",
        filename: filename,
        inprogress: false,
        properties: {
            transcribemodel: transcribemodel
        }
    }
    tasks.push(task)
    saveTasks()
    res.send({ id: task.id })
})

/**
 * @api {get} /api/tasks/taketranscribetask/:transcribemodel/ Process a transcription task
 * @apiVersion 1.0.0
 * @apiGroup Workers
 * 
 * @apiParam {String="tiny","base","small","medium","large-v2"}  transcribemodel     Whisper model the worker is able to process
  * 
 * @apiSuccess {String} id          Unique ID of the task.
 * @apiSuccess {String} filename    Filename within the input folder.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "id": "950a0071-dfeb-40c5-9889-a45deb9e69f7",
 *         "filename": "arabic_speec.ogg"
 *     }
 * 
 * @apiError (400 Bad Request) NoTask There is no matching task in the pipeline
 * @apiError (400 Bad Request) ModelNotSupported The given <i>transcribemodel</i> is not supported
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "NoTask"
 *     }
 */
apiRouter.get('/taketranscribetask/:transcribemodel', function(req, res) {
    const transcribemodel = req.params.transcribemodel
    if (!["tiny","base","small","medium","large-v2"].includes(transcribemodel)) {
        res.status(400).send({ error: "ModelNotSupported" })
        return
    }
    const firstMatchingTask = tasks.find(task => !task.inprogress && task.type === "transcribe" && task.properties.transcribemodel === transcribemodel)
    if (!firstMatchingTask) {
        res.status(400).send({ error: "NoTask" })
        return
    } else {
        firstMatchingTask.inprogress = true
        saveTasks()
        res.json({
            id: firstMatchingTask.id,
            filename: firstMatchingTask.filename
        })
    }
})

/**
 * @api {post} /api/tasks/reporttranscribecompletion/:id Report transcription completion
 * @apiVersion 1.0.0
 * @apiGroup Workers
 * 
 * @apiParam {String} id            ID of the completed transcription task
 * 
 * @apiBody {String} language       Detected language
 * @apiBody {String} originaltext   Transcribed original text
 * @apiBody {String} englishtext    Transcribed text translated in to english
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 * 
 * @apiError (400 Bad Request) TaskNotFound There was no task for the given <i>id</i>
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "TaskNotFound"
 *     }
 */
apiRouter.post('/reporttranscribecompletion/:id', function(req, res) {
    const id = req.params.id
    const matchingTask = tasks.find(task => task.id === id)
    if (!matchingTask) {
        res.status(400).send({ error: "TaskNotFound" })
        return
    }
    const reportedResult = req.body
    const resultAbsolutePath = path.join(absoluteOutputPath, id.substring(0, 6).split("").join("/"))
    fs.mkdirSync(resultAbsolutePath, { recursive: true})
    const absoluteOutputFilePath = path.join(resultAbsolutePath, id)
    matchingTask.result = reportedResult
    matchingTask.completedat = new Date().toISOString()
    delete matchingTask.inprogress
    fs.writeFileSync(absoluteOutputFilePath, JSON.stringify(matchingTask, null, 2), "utf8")
    const absoluteInputFilename = path.join(absoluteInputPath, matchingTask.filename)
    if (fs.existsSync(absoluteInputFilename)) {
        fs.rmSync(absoluteInputFilename)
    }
    tasks.splice(tasks.indexOf(matchingTask), 1)
    saveTasks()
    res.send()
})

/**
 * @api {get} /api/tasks/status/:id/ Get task status
 * @apiVersion 1.0.0
 * @apiGroup Workers
 * 
 * @apiParam {String} id            ID of the task to check
 * 
 * @apiSuccess {String="waiting","inprogress","completed"}   status                                     Status of the task. "waiting" means that the task is reported but not started yet. "inprogress" means that some worker is handling the task currently.
 * @apiSuccess {Object}                                      task                                       Structure with task information. Only set when the task is completed.
 * @apiSuccess {String}                                      task.id                                    Unique ID of the task.
 * @apiSuccess {String}                                      task.type                                  Type of the task. Can be "transcribe", "translate" or "classifyimage"
 * @apiSuccess {String}                                      task.filename                              File name of the object within the input directory
 * @apiSuccess {Object}                                      task.properties                            Settings for the task. Depends on the task type
 * @apiSuccess {Boolean}                                     task.completedat                           ISO time of the completion of the task by the worker
 * @apiSuccess {Object}                                      task.result                                Result of the task completion. Content depends on the task type
 *
 * @apiSuccessExample {json} In progress:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": "inprogress"
 *     }
 *
 * @apiSuccessExample {json} Completed:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": "completed",
 *         "task": {
 *             "id": "bb086c2a-cb15-43fc-923f-fab49d70ddd2",
 *             "type": "transcribe",
 *             "filename": "abc.txt",
 *             "properties": {
 *                 "transcribemodel": "tiny"
 *             },
 *             "completedat": "2024-01-24T13:42:21.238Z"
 *             "result": {
 *                 "language": "de",
 *                 "originaltext": "holla",
 *                 "englishtext": "die waldfee"
 *             },
 *         }
 *     }
 * 
 * @apiError (400 Bad Request) TaskNotFound There was no task for the given <i>id</i>
 * @apiError (500 Server Error) FileAccessError When the task has a result file but it cannot be read
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "TaskNotFound"
 *     }
 */
apiRouter.get('/status/:id', function(req, res) {
    const id = req.params.id
    const matchingTask = tasks.find(task => task.id === id)
    if (matchingTask) {
        res.send({ status: matchingTask.inprogress ? "inprogress" : "waiting" })
        return
    } else {
        const resultAbsolutePath = path.join(absoluteOutputPath, id.substring(0, 6).split("").join("/"))
        const absoluteOutputFilePath = path.join(resultAbsolutePath, id)
        if (!fs.existsSync(absoluteOutputFilePath)) {
            res.status(400).send({ error: "TaskNotFound" })
            return
        } else {
            fs.readFile(absoluteOutputFilePath, "utf8", (error, data) => {
                if (error) {
                    res.status(500).send({ error: error })
                } else {
                    const task = JSON.parse(data)
                    res.send({
                        status: "completed",
                        task: task
                    })
                }
            })
        }
    }
})

module.exports = apiRouter