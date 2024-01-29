const tasksbase = require("../../../tasksbase")
const express = require("express")
const apiRouter = express.Router()

/**
 * @api {post} /api/tasks/translate/reportcompletion/:id Report transcription completion
 * @apiVersion 1.0.0
 * @apiGroup Transcription
 * 
 * @apiParam {String} id            ID of the completed transcription task
 * 
 * @apiBody {String} language       Detected language
 * @apiBody {String} originaltext   Transcribed original text
 * @apiBody {String} englishtext    Transcribed text translated in to english
 *
 * @apiSuccessExample Success
 *     HTTP/1.1 200 OK
 * 
 * @apiError (400 Bad Request) TaskNotFound There was no task for the given <i>id</i>
 * 
 * @apiErrorExample {json} Task not found
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "TaskNotFound"
 *     }
 */
apiRouter.post('/:id', tasksbase.reportTaskCompletion)

module.exports = apiRouter