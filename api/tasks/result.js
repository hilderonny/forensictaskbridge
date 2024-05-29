const tasksbase = require("../../tasksbase")
const express = require("express")
const apiRouter = express.Router()

/**
 * @api {get} /api/tasks/result/:id Get task result
 * @apiVersion 2.1.0
 * @apiGroup General
 * 
 * @apiParam {String} id            ID of the task to check
 * 
 * @apiSuccess {String}                                      id                                    Unique ID of the task.
 * @apiSuccess {String}                                      type                                  Type of the task. Can be "classifyimage", "scanforvirus", "transcribe" or "translate"
 * @apiSuccess {String}                                      filename                              File name of the object within the input directory
 * @apiSuccess {Object}                                      properties                            Settings for the task. Depends on the task type
 * @apiSuccess {Boolean}                                     completedat                           ISO time of the completion of the task by the worker
 * @apiSuccess {Object}                                      result                                Result of the task completion. Content depends on the task type
 *
 * @apiSuccessExample {json} Result
 *     HTTP/1.1 200 OK
 *     {
 *         "id": "bb086c2a-cb15-43fc-923f-fab49d70ddd2",
 *         "type": "transcribe",
 *         "filename": "abc.txt",
 *         "properties": {
 *             "transcribemodel": "tiny"
 *         },
 *         "completedat": "2024-01-24T13:42:21.238Z"
 *         "result": {
 *             "language": "de",
 *             "originaltext": "holla",
 *             "englishtext": "die waldfee"
 *         },
 *     }
 * 
 * @apiError (400 Bad Request) TaskNotFound There was no completed task for the given <i>id</i>
 * 
 * @apiErrorExample {json} Task not found
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "TaskNotFound"
 *     }
 */
apiRouter.get('/:id', function(req, res) {
    const id = req.params.id
    const taskResult = tasksbase.getTaskResult(id)
    if (!taskResult) {
        res.status(400).send({ error: "TaskNotFound" })
        return
    } else {
        res.send(taskResult)
    }
})

module.exports = apiRouter