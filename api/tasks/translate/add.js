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
 * @apiBody {String}  text              Text to translate. Should be UTF-8 encoded.
 * 
 * @apiParamExample {json} Request body example
 *     POST http://127.0.0.1:5000/api/tasks/translate/add/en/de
 *     {
 *         "text": "Hello world"
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
 * @apiError (400 Bad Request) NoText There is no text given to translate
 * 
 * @apiErrorExample {json} Error response
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "NoText"
 *     }
 */
apiRouter.post('/:sourcelanguage/:targetlanguage', function(req, res) {
    if (!req.body || !req.body.text) {
        res.status(400).send({ error: "NoText" })
        return
    }
    const task = tasksbase.createTask("translate")
    task.properties = {
        sourcelanguage: req.params.sourcelanguage,
        targetlanguage: req.params.targetlanguage,
        text: req.body.text
    }
    tasksbase.saveTasks()
    res.send({ id: task.id })
})

module.exports = apiRouter