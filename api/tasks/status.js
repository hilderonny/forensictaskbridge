const tasksbase = require("../../tasksbase")
const express = require("express")
const apiRouter = express.Router()

/**
 * @api {get} /api/tasks/status/:id/ Get task status
 * @apiVersion 1.0.0
 * @apiGroup General
 * 
 * @apiParam {String} id            ID of the task to check
 * 
 * @apiSuccess {String="waiting","running","done"}           status                                     Status of the task. "waiting" means that the task is reported but not started yet. "running" means that some worker is handling the task currently.
 *
 * @apiSuccessExample {json} Running
 *     HTTP/1.1 200 OK
 *     {
 *         "status": "running"
 *     }
 *
 * @apiSuccessExample {json} Done
 *     HTTP/1.1 200 OK
 *     {
 *         "status": "done"
 *     }
 * 
 * @apiError (400 Bad Request) TaskNotFound There was no task for the given <i>id</i>
 * @apiError (500 Server Error) FileAccessError When the task has a result file but it cannot be read
 * 
 * @apiErrorExample {json} Task not found
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "TaskNotFound"
 *     }
 */
apiRouter.get('/:id', function(req, res) {
    const id = req.params.id
    const matchingTask = tasksbase.getTaskById(id)
    if (matchingTask) {
        res.send({ status: matchingTask.status })
        return
    } else {
        res.status(400).send({ error: "TaskNotFound" })
        return
    }
})

module.exports = apiRouter