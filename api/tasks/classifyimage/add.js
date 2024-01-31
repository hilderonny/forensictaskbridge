const tasksbase = require("../../../tasksbase")
const express = require("express")
const apiRouter = express.Router()

/**
 * @api {post} /api/tasks/classifyimage/add/:filename/:targetlanguage Add an image classification task
 * @apiVersion 1.0.0
 * @apiGroup Image classification
 * 
 * @apiParam {String}               filename           Name of the file to process. Must be located in the input folder
 * @apiParam {String="en","de"}     targetlanguage     Language code in which the names of the classes should be returned
 * 
 * @apiSuccess {String} id                         Unique ID of the newly created image classification task.
 *
 * @apiSuccessExample {json} Success response
 *     HTTP/1.1 200 OK
 *     {
 *         "id": "950a0071-dfeb-40c5-9889-a45deb9e69f7"
 *     }
 * 
 * @apiError (400 Bad Request) FileNotFound There was no file in the input folder for the given <i>filename</i>
 * @apiError (400 Bad Request) LanguageNotSupported The given <i>targetlanguage</i> is not supported
 * 
 * @apiErrorExample {json} Error response
 *     HTTP/1.1 400 Bad Request
 *     {
 *         "error": "FileNotFound"
 *     }
 */
apiRouter.post('/:filename/:targetlanguage', function(req, res) {
    const filename = req.params.filename
    if (!tasksbase.doesInputFileExist(filename)) {
        res.status(400).send({ error: "FileNotFound" })
        return
    }
    const targetlanguage = req.params.targetlanguage
    if (!["en", "de"].includes(targetlanguage)) {
        res.status(400).send({ error: "LanguageNotSupported" })
        return
    }
    const task = tasksbase.createTask("classifyimage", filename);
    task.properties = {
        targetlanguage: targetlanguage
    }
    tasksbase.saveTasks()
    res.send({ id: task.id })
})

module.exports = apiRouter