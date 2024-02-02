const tasksbase = require("../../../tasksbase")
const express = require("express")
const apiRouter = express.Router()

/**
 * @api {post} /api/tasks/translate/add/:sourcelanguage/:targetlanguage Add a translation task
 * @apiVersion 1.0.0
 * @apiGroup Translation
 * 
 * @apiParam {String} sourcelanguage    Original language of the text to translate, e.g. "en" or "de"
 * @apiParam {String} targetlanguage    Language in which the text should be translated into, e.g. "en" or "de"
 * 
 * @apiBody {Object[]}  segments                Separate text segments
 * @apiBody {Number}    segments.start          Relative start time of the segment in the media file in milliseconds
 * @apiBody {Number}    segments.end            Relative end time of the segment in the media file in milliseconds
 * @apiBody {String}    segments.text           Text to translate
 * 
 * @apiParamExample {json} Request body example
 *     POST http://127.0.0.1:5000/api/tasks/translate/add/en/de
 *     {
 *         "segments": [
 *             {
 *                 "start": 1234567,
 *                 "end": 8765342,
 *                 "text": "Hello world"
 *             }
 *         ]
 *     }
 * 
 * @apiSuccess {String} id               Unique ID of the newly created transcription task.
 *
 * @apiSuccessExample {json} Success response
 *     HTTP/1.1 200 OK
 *     {
 *         "id": "950a0071-dfeb-40c5-9889-a45deb9e69f7"
 *     }
 * 
 * @apiError (400 Bad Request) NoSegments There are no text segments given to translate
 * 
 * @apiErrorExample {json} Error response
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "NoSegments"
 *     }
 */
apiRouter.post('/:sourcelanguage/:targetlanguage', function(req, res) {
    if (!req.body || !req.body.segments) {
        res.status(400).send({ error: "NoSegments" })
        return
    }
    const task = tasksbase.createTask("translate")
    task.properties = {
        sourcelanguage: req.params.sourcelanguage,
        targetlanguage: req.params.targetlanguage,
        segments: req.body.segments
    }
    tasksbase.saveTasks()
    res.send({ id: task.id })
})

module.exports = apiRouter