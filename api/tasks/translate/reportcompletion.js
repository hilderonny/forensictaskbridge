const tasksbase = require("../../../tasksbase")
const express = require("express")
const apiRouter = express.Router()

/**
 * @api {post} /api/tasks/translate/reportcompletion/:id Report translation completion
 * @apiVersion 1.0.0
 * @apiGroup Translation
 * 
 * @apiParam {String} id                  ID of the completed translation task
 * 
 * @apiBody {Object[]}  segments                Separate text segments
 * @apiBody {Number}    segments.start          Relative start time of the segment in the media file in milliseconds
 * @apiBody {Number}    segments.end            Relative end time of the segment in the media file in milliseconds
 * @apiBody {String}    segments.text           Translated text
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