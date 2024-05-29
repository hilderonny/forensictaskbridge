const express = require("express")
const apiRouter = express.Router()

const workers = {}

/**
 * @api {get} /api/workers Request all workers
 * @apiVersion 2.1.0
 * @apiGroup General
 * 
 * @apiSuccess {Object}     result                                               Object describing the result.
 * @apiSuccess {Object[]}   result.workers                                       List of known workers. Can be empty when no worker reported ts state within the last 60 minutes.
 * @apiSuccess {Number}     result.workers.remoteaddress                         IP of the worker in IPv6 format.
 * @apiSuccess {Number}     result.workers.lastpingat                            Unix timestamp from server when the worker pinged the server the last time.
 * @apiSuccess {String}     result.workers.status                                Status of the worker. Can be "idle" or "working".
 * @apiSuccess {String}     result.workers.type                                  Type of the task the worker is able to handle. Can be "classifyimage", "scanforvirus", "transcribe" or "translate"
 * @apiSuccess {Number}     result.time                                          Actual unix timestamp from server for calculating durations independent on the client time.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "time": 1707484263238,
 *         "workers": [
 *             {
 *                 "lastpingat": 1707484293663,
 *                 "remoteaddress": "::ffff:127.0.0.1",
 *                 "type": "transcribe"
 *             },
 *             {
 *                 "lastpingat": 1707484160951,
 *                 "remoteaddress": "::ffff:127.0.0.1",
 *                 "type": "translate"
 *             }
 *         ]
 *     }
 */
apiRouter.get('/', function(req, res) {
    cleanupWorkers()
    res.json({
        time: Date.now(),
        workers: Object.values(workers)
    })
})

apiRouter.notifyAboutWorker = function(remoteaddress, type, status) {
    const identifier = remoteaddress + type
    var worker = workers[identifier]
    if (!worker) {
        worker = {
            remoteaddress: remoteaddress,
            type: type
        }
        workers[identifier] = worker
    }
    worker.status = status
    worker.lastpingat = Date.now()
    cleanupWorkers()
}

function cleanupWorkers() {
    const before60minutes = Date.now() - 1000 * 60 * 5 // Delete worker which is inactive for 5 minutes (working or offline)
    for (const identifier in workers) {
        const worker = workers[identifier]
        if (worker.lastpingat < before60minutes) {
            delete workers[identifier]
        }
    }
}

module.exports = apiRouter