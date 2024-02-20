const tasksbase = require("../../../tasksbase")
const workersApi = require("../../workers")
const express = require("express")
const apiRouter = express.Router()

/**
 * @api {get} /api/tasks/classifyimage/take/ Process an image classification task
 * @apiVersion 1.0.0
 * @apiGroup Image classification
  * 
 * @apiSuccess {String} id                Unique ID of the task.
 * @apiSuccess {String} filename          Filename within the input folder.
 * @apiSuccess {String} targetlanguage    The language of the expected class names.
 *
 * @apiSuccessExample {json} Success response
 *     HTTP/1.1 200 OK
 *     {
 *         "id": "950a0071-dfeb-40c5-9889-a45deb9e69f7",
 *         "filename": "cow.jpg",
 *         "targetlanguage": "de"
 *     }
 * 
 * @apiError (400 Bad Request) NoTask There is no matching task in the pipeline
 * 
 * @apiErrorExample {json} Error response
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "NoTask"
 *     }
 */
apiRouter.get('/', function(req, res) {
    const firstMatchingTask = tasksbase.getTasks().find(task => task.status == "waiting" && task.type === "classifyimage")
    workersApi.notifyAboutWorker(req.socket.remoteAddress, "classifyimage", firstMatchingTask ? "working" : "idle")
    if (!firstMatchingTask) {
        res.status(400).send({ error: "NoTask" })
        return
    } else {
        firstMatchingTask.status = "running"
        firstMatchingTask.startedat = Date.now()
        firstMatchingTask.remoteaddress = req.socket.remoteAddress
        tasksbase.saveTasks()
        res.json({
            id: firstMatchingTask.id,
            filename: firstMatchingTask.filename,
            targetlanguage: firstMatchingTask.properties.targetlanguage
        })
    }
})

module.exports = apiRouter