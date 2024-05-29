const tasksbase = require("../../../tasksbase")
const express = require("express")
const apiRouter = express.Router()

/**
 * @api {post} /api/tasks/transcribe/reportcompletion/:id Report transcription completion
 * @apiVersion 1.0.0
 * @apiGroup Transcription
 * 
 * @apiParam {String} id            ID of the completed transcription task
 * 
 * @apiBody {String}    language                   Detected language
 * @apiBody {Object}    original                   Text information in the detected language
 * @apiBody {Object[]}  original.segments          Separate text segments
 * @apiBody {Number}    original.segments.start    Relative start time of the segment in the media file in milliseconds
 * @apiBody {Number}    original.segments.end      Relative end time of the segment in the media file in milliseconds
 * @apiBody {String}    original.segments.text     Transcribed text in the detected language
 * @apiBody {Object}    en                         Text information in english
 * @apiBody {Object[]}  en.segments                Separate text segments
 * @apiBody {Number}    en.segments.start          Relative start time of the segment in the media file in milliseconds
 * @apiBody {Number}    en.segments.end            Relative end time of the segment in the media file in milliseconds
 * @apiBody {String}    en.segments.text           Transcribed text in english
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
apiRouter.post('/:id', tasksbase.reportTaskCompletion)

module.exports = apiRouter