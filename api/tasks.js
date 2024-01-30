const tasksbase = require("../tasksbase")
const express = require("express")
const apiRouter = express.Router()

/**
 * @api {get} /api/tasks Request all tasks
 * @apiVersion 1.0.0
 * @apiGroup General
 * 
 * @apiSuccess {Object[]}   tasks                                       List of running tasks. Can be empty when no task is running.
 * @apiSuccess {String}     tasks.id                                    Unique ID of the task.
 * @apiSuccess {String}     tasks.type                                  Type of the task to run. Can be "transcribe", "translate" or "classifyimage"
 * @apiSuccess {String}     tasks.filename                              File name of the object to process within the input directory
 * @apiSuccess {String}     tasks.status                                "waiting" when task is waiting for processing, "running" when the task is currently processed by a worker and "done" when the task finished
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
 *             "status": "waiting",
 *             "properties": {
 *                 "transcribemodel": "large-v2"
 *             }
 *         },
 *         {
 *             "id": "6e5da9d1-ff60-4a3f-a663-892dbb50f347",
 *             "type": "translate",
 *             "filename": "english_text.txt",
 *             "status": "running",
 *             "properties": {
 *                 "translatesourcelanguage": "en",
 *                 "translatetargetlanguage": "de"
 *             }
 *         },
 *         {
 *             "id": "bc7c1468-47da-46af-8155-beabe813535b",
 *             "type": "classifyimage",
 *             "filename": "apples.jpg",
 *             "status": "done",
 *             "properties": {
 *                 "classifyimagelanguage": "de"
 *             }
 *         }
 *     ]
 */
apiRouter.get('/', function(req, res) {
    res.json(tasksbase.getTasks())
})

module.exports = apiRouter