const tasksbase = require("../../../tasksbase")
const workersApi = require("../../workers")
const express = require("express")
const apiRouter = express.Router()

/**
 * @api {get} /api/tasks/scanforvirus/take/:scannerprogram/ Process a virus scanning task
 * @apiVersion 2.1.0
 * @apiGroup Virus scanning
 * 
 * @apiParam {String="clamav"}  scannerprogram     Program to use for scanning
  * 
 * @apiSuccess {String} id                       Unique ID of the task.
 * @apiSuccess {String} filename                 Filename within the input folder.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "id": "950a0071-dfeb-40c5-9889-a45deb9e69f7",
 *         "filename": "malware.exe"
 *     }
 * 
 * @apiError (400 Bad Request) NoTask There is no matching task in the pipeline
 * @apiError (400 Bad Request) ProgramNotSupported The given <i>scannerprogram</i> is not supported
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "NoTask"
 *     }
 */
apiRouter.get('/:scannerprogram', function(req, res) {
    const scannerprogram = req.params.scannerprogram
    if (!["clamav"].includes(scannerprogram)) {
        res.status(400).send({ error: "ProgramNotSupported" })
        return
    }
    const firstMatchingTask = tasksbase.getTasks().find(task => task.status == "waiting" && task.type === "scanforvirus" && task.properties.scannerprogram === scannerprogram)
    workersApi.notifyAboutWorker(req.socket.remoteAddress, "scanforvirus", firstMatchingTask ? "working" : "idle")
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
            filename: firstMatchingTask.filename
        })
    }
})

module.exports = apiRouter