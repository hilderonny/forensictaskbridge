const tasksbase = require("../../tasksbase")
const express = require("express")
const apiRouter = express.Router()

/**
 * @api {get} /api/tasks/restart/:id/ Restart a task
 * @apiVersion 1.0.0
 * @apiGroup General
 * 
 * @apiParam {String} id            ID of the task to restart
 * 
 * @apiSuccess (200) Task successfully restarted
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
apiRouter.get('/:id', function(req, res) {
    const id = req.params.id
    const matchingTask = tasksbase.getTaskById(id)
    if (matchingTask) {
        matchingTask.status = "waiting"
        tasksbase.saveTasks()
        res.sendStatus(200)
        return
    } else {
        res.status(400).send({ error: "TaskNotFound" })
        return
    }
})

module.exports = apiRouter