const tasksbase = require("../../../tasksbase")
const express = require("express")
const apiRouter = express.Router()

/**
 * @api {post} /api/tasks/scanforvirus/add/:filename/:scannerprogram Add a virus scanning task task
 * @apiVersion 2.1.0
 * @apiGroup Virus scanning
 * 
 * @apiParam {String} filename                  Name of the file to process. Must be located in the input folder
 * @apiParam {String} scannerprogram            Program to use for scanning. Can be "clamav"
 * 
 * @apiSuccess {String} id                      Unique ID of the newly created virus scanning task.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "id": "950a0071-dfeb-40c5-9889-a45deb9e69f7"
 *     }
 * 
 * @apiError (400 Bad Request) FileNotFound There was no file in the input folder for the given <i>filename</i>
 * @apiError (400 Bad Request) ProgramNotSupported The given <i>scannerprogram</i> is not supported
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "FileNotFound"
 *     }
 */
apiRouter.post('/:filename/:scannerprogram', function(req, res) {
    const filename = req.params.filename
    if (!tasksbase.doesInputFileExist(filename)) {
        res.status(400).send({ error: "FileNotFound" })
        return
    }
    const scannerprogram = req.params.scannerprogram
    if (!["clamav"].includes(scannerprogram)) {
        res.status(400).send({ error: "ProgramNotSupported" })
        return
    }
    const task = tasksbase.createTask("scanforvirus", filename);
    task.properties = {
        scannerprogram: scannerprogram
    }
    tasksbase.saveTasks()
    res.send({ id: task.id })
})

module.exports = apiRouter