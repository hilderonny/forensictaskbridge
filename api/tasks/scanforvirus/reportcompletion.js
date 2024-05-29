const tasksbase = require("../../../tasksbase")
const express = require("express")
const apiRouter = express.Router()

/**
 * @api {post} /api/tasks/scanforvirus/reportcompletion/:id Report virus scanning completion
 * @apiVersion 2.1.0
 * @apiGroup Virus scanning
 * 
 * @apiParam {String}   id               ID of the completed virus scanning task
 * 
 * @apiBody {String}    status           Status of scanning. "OK" means no virus found. "FOUND" means there was a virus
 * @apiBody {String}    virus            Identifier string of the found virus. Only set when status = "FOUND"
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