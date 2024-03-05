const tasksbase = require("../../../tasksbase")
const express = require("express")
const apiRouter = express.Router()

/**
 * @api {post} /api/tasks/transcribe/add/:filename/:transcribemodel/:notranslationlanguage     Add a transcribe task
 * @apiVersion 2.0.0
 * @apiGroup Transcription
 * 
 * @apiParam {String}                                                       filename                  Name of the file to process. Must be located in the input folder
 * @apiParam {String="tiny","base","small","medium","large-v2"}             transcribemodel           Whisper model to use for transcription.
 * @apiParam {String}                                                       notranslationlanguage     Language for skipping translation. When the detected language in the audio file is the one given here, no translation into english is done.
 * 
 * @apiSuccess {String} id                         Unique ID of the newly created transcription task.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "id": "950a0071-dfeb-40c5-9889-a45deb9e69f7"
 *     }
 * 
 * @apiError (400 Bad Request) FileNotFound There was no file in the input folder for the given <i>filename</i>
 * @apiError (400 Bad Request) ModelNotSupported The given <i>transcribemodel</i> is not supported
 * 
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "FileNotFound"
 *     }
 */
apiRouter.post('/:filename/:transcribemodel/:notranslationlanguage', function(req, res) {
    const filename = req.params.filename
    if (!tasksbase.doesInputFileExist(filename)) {
        res.status(400).send({ error: "FileNotFound" })
        return
    }
    const transcribemodel = req.params.transcribemodel
    if (!["tiny","base","small","medium","large-v2"].includes(transcribemodel)) {
        res.status(400).send({ error: "ModelNotSupported" })
        return
    }
    const notranslationlanguage = req.params.notranslationlanguage
    const task = tasksbase.createTask("transcribe", filename);
    task.properties = {
        transcribemodel: transcribemodel,
        notranslationlanguage: notranslationlanguage
    }
    tasksbase.saveTasks()
    res.send({ id: task.id })
})

module.exports = apiRouter