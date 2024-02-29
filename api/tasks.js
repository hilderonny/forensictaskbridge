const tasksbase = require("../tasksbase")
const express = require("express")
const apiRouter = express.Router()

/**
 * @api {get} /api/tasks Request all tasks
 * @apiVersion 1.0.0
 * @apiGroup General
 * 
 * @apiSuccess {Object}     result                                             Object describing the result.
 * @apiSuccess {Object}     result.taskcount                                   Object describing the task completion statistic
 * @apiSuccess {Number}     result.taskcount.classifyimage                     Number of classifyimage tasks previously completed
 * @apiSuccess {Number}     result.taskcount.transcribe                        Number of transcribe tasks previously completed
 * @apiSuccess {Number}     result.taskcount.translate                         Number of translate tasks previously completed
 * @apiSuccess {Object[]}   result.tasks                                       List of running tasks. Can be empty when no task is running.
 * @apiSuccess {Number}     result.tasks.completedat                           Unix timestamp from server when the task was finished.
 * @apiSuccess {Number}     result.tasks.createdat                             Unix timestamp from server when the task was added to the queue.
 * @apiSuccess {String}     result.tasks.filename                              File name of the object to process within the input directory.
 * @apiSuccess {String}     result.tasks.id                                    Unique ID of the task.
 * @apiSuccess {Object}     result.tasks.properties                            Additional properties for specific tasks.
 * @apiSuccess {String}     result.tasks.properties.transcribemodel            For task "transcribe": Defines the Whisper model to use. Can be "tiny", "base", "small", "medium" or "large-v2".
 * @apiSuccess {String}     result.tasks.properties.translatesourcelanguage    For task "translate": The source language of the text. E.g. "en".
 * @apiSuccess {String}     result.tasks.properties.translatetargetlanguage    For task "translate": The target language in which the text should be translated. E.g. "de".
 * @apiSuccess {String}     result.tasks.properties.classifyimagelanguage      For task "classifyimage": The target language of the image classification results. Can be "de" or "en".
 * @apiSuccess {Number}     result.tasks.remoteaddress                         IPv4 or IPv6 address of the worker which processed the task.
 * @apiSuccess {Number}     result.tasks.startedat                             Unix timestamp from server when a worker started processing the task.
 * @apiSuccess {String}     result.tasks.status                                "waiting" when task is waiting for processing, "running" when the task is currently processed by a worker and "done" when the task finished.
 * @apiSuccess {String}     result.tasks.type                                  Type of the task to run. Can be "transcribe", "translate" or "classifyimage"
 * @apiSuccess {Number}     result.time                                        Actual unix timestamp from server for calculating durations independent on the client time.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "taskcount": {
 *             "classifyimage": 123,
 *             "transcribe": 234,
 *             "translate": 345,
 *         },
 *         "time": 1707484263238,
 *         "tasks": [
 *             {
 *                 "createdat": 1707484263238,
 *                 "filename": "arabic_speec.ogg",
 *                 "id": "950a0071-dfeb-40c5-9889-a45deb9e69f7",
 *                 "properties": {
 *                     "transcribemodel": "large-v2"
 *                 },
 *                 "status": "waiting",
 *                 "type": "transcribe"
 *             },
 *             {
 *                 "createdat": 1707484293663,
 *                 "filename": "english_text.txt",
 *                 "id": "6e5da9d1-ff60-4a3f-a663-892dbb50f347",
 *                 "properties": {
 *                     "translatesourcelanguage": "en",
 *                     "translatetargetlanguage": "de"
 *                 },
 *                 "remoteaddress": "::ffff:127.0.0.1",
 *                 "startedat": 1707484309743,
 *                 "status": "running",
 *                 "type": "translate"
 *             },
 *             {
 *                 "completedat": 1707484160951,
 *                 "createdat": 1707484100216,
 *                 "filename": "apples.jpg",
 *                 "id": "bc7c1468-47da-46af-8155-beabe813535b",
 *                 "properties": {
 *                     "classifyimagelanguage": "de"
 *                 },
 *                 "remoteaddress": "::ffff:127.0.0.1",
 *                 "startedat": 1707484137103,
 *                 "status": "done",
 *                 "type": "classifyimage"
 *             }
 *         ]
 *     }
 */
apiRouter.get('/', function(req, res) {
    res.json({
        taskcount: tasksbase.getTaskCount(),
        time: Date.now(),
        tasks: tasksbase.getTasks() 
    })
})

module.exports = apiRouter