const tasksbase = require("../../../tasksbase")
const express = require("express")
const apiRouter = express.Router()

/**
 * @api {get} /api/tasks/transcribe/take/:transcribemodel/ Process a transcription task
 * @apiVersion 1.0.0
 * @apiGroup Transcription
 * 
 * @apiParam {String="tiny","base","small","medium","large-v2","large-v3"}  transcribemodel     Whisper model the worker is able to process
  * 
 * @apiSuccess {String} id          Unique ID of the task.
 * @apiSuccess {String} filename    Filename within the input folder.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "id": "950a0071-dfeb-40c5-9889-a45deb9e69f7",
 *         "filename": "arabic_speec.ogg"
 *     }
 * 
 * @apiError (400 Bad Request) NoTask There is no matching task in the pipeline
 * @apiError (400 Bad Request) ModelNotSupported The given <i>transcribemodel</i> is not supported
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "NoTask"
 *     }
 */
apiRouter.get('/:transcribemodel', function(req, res) {
    const transcribemodel = req.params.transcribemodel
    if (!["tiny","base","small","medium","large-v2","large-v3"].includes(transcribemodel)) {
        res.status(400).send({ error: "ModelNotSupported" })
        return
    }
    const firstMatchingTask = tasksbase.getTasks().find(task => task.status == "waiting" && task.type === "transcribe" && task.properties.transcribemodel === transcribemodel)
    if (!firstMatchingTask) {
        res.status(400).send({ error: "NoTask" })
        return
    } else {
        firstMatchingTask.status = "running"
        tasksbase.saveTasks()
        res.json({
            id: firstMatchingTask.id,
            filename: firstMatchingTask.filename
        })
    }
})

module.exports = apiRouter