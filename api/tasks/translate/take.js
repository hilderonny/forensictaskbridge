const tasksbase = require("../../../tasksbase")
const express = require("express")
const apiRouter = express.Router()

/**
 * @api {get} /api/tasks/translate/take/ Process a translation task
 * @apiVersion 1.0.0
 * @apiGroup Translation
 * 
 * @apiSuccess {String} id                         Unique ID of the task
 * @apiSuccess {String} sourcelanguage             Language of the original text
 * @apiSuccess {String} targetlanguage             Language in which the text should be translated into
 * @apiSuccess {Object[]}  segments                Separate text segments
 * @apiSuccess {Number}    segments.start          Relative start time of the segment in the media file in milliseconds
 * @apiSuccess {Number}    segments.end            Relative end time of the segment in the media file in milliseconds
 * @apiSuccess {String}    segments.text           Text to translate
 *
 * @apiSuccessExample {json} Success response
 *     HTTP/1.1 200 OK
 *     {
 *         "id": "950a0071-dfeb-40c5-9889-a45deb9e69f7",
 *         "sourcelanguage": "en",
 *         "targetlanguage": "de",
 *         "segments": [
 *             {
 *                 "start": 1234567,
 *                 "end": 8765342,
 *                 "text": "Hello world"
 *             }
 *         ]
 *     }
 * 
 * @apiError (400 Bad Request) NoTask There is no matching task in the pipeline
 * 
 * @apiErrorExample {json} Error response
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "NoTask"
 *     }
 */
apiRouter.get('/', function(req, res) {
    const firstMatchingTask = tasksbase.getTasks().find(task => task.status == "waiting" && task.type === "translate")
    if (!firstMatchingTask) {
        res.status(400).send({ error: "NoTask" })
        return
    } else {
        firstMatchingTask.status = "running"
        tasksbase.saveTasks()
        res.json({
            id: firstMatchingTask.id,
            sourcelanguage: firstMatchingTask.properties.sourcelanguage,
            targetlanguage: firstMatchingTask.properties.targetlanguage,
            segments: firstMatchingTask.properties.segments
        })
    }
})

module.exports = apiRouter