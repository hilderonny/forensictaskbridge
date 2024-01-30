const tasksbase = require("../../tasksbase")
const express = require("express")
const apiRouter = express.Router()

/**
 * @api {delete} /api/tasks/remove/:id/ Deletes a task and its results
 * @apiVersion 1.0.0
 * @apiGroup General
 * 
 * @apiParam {String} id            ID of the task to delete
 * 
 * @apiSuccess (200) Task deleted or not
 *
 * @apiSuccessExample Success
 *     HTTP/1.1 200 OK
 */
apiRouter.delete('/:id', function(req, res) {
    const id = req.params.id
    tasksbase.deleteTask(id)
    res.sendStatus(200)
})

module.exports = apiRouter