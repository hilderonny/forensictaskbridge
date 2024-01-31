const tasksbase = require("../../../tasksbase")
const express = require("express")
const apiRouter = express.Router()

/**
 * @api {post} /api/tasks/classifyimage/reportcompletion/:id Report image classification completion
 * @apiVersion 1.0.0
 * @apiGroup Image classification
 * 
 * @apiParam {String}   id                ID of the completed transcription task
 * 
 * @apiBody {String[]}  predictions       Array of possible image classes
 * @apiBody {String}    class             Identified class (best prediction)
 * @apiBody {String}    name              Name of the class in the requested target language
 * @apiBody {Number}    probability       Probability of the class (0.0 = 0% ... 1.0 = 100%)
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