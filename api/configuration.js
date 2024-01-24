/**
 * @api {get} /api/configuration Request configuration information
 * @apiVersion 1.0.0
 * @apiName GetConfiguration
 * @apiGroup General
 * 
 * @apiSuccess {Object}   paths                  Path settings
 * @apiSuccess {Object}   paths.input            Information about the input path where the server receives tasks to process
 * @apiSuccess {String}   paths.input.path       Absolute path on server
 * @apiSuccess {Boolean}  paths.input.exists     "true" when the path exists on the server or "false", when not
 * @apiSuccess {Boolean}  paths.input.canRead    "true" when the path can be read by the server or "false", when not
 * @apiSuccess {Boolean}  paths.input.canWrite   "true" when the path can be written by the server or "false", when not
 * @apiSuccess {Object}   paths.output           Information about the output path where the server puts task results
 * @apiSuccess {String}   paths.output.path      Absolute path on server
 * @apiSuccess {Boolean}  paths.output.exists    "true" when the path exists on the server or "false", when not
 * @apiSuccess {Boolean}  paths.output.canRead   "true" when the path can be read by the server or "false", when not
 * @apiSuccess {Boolean}  paths.output.canWrite  "true" when the path can be written by the server or "false", when not
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "paths": {
 *             "input": {
 *                 "path": "/data/input",
 *                 "exists": true,
 *                 "canRead": true,
 *                 "canWrite": false,
 *             },
 *             "output": {
 *                 "path": "/data/output",
 *                 "exists": true,
 *                 "canRead": true,
 *                 "canWrite": true,
 *             }
 *         }
 *     }
 */

const config = require("../config.json")

const express = require("express")
const fs = require("fs")
const {resolve} = require("path")

const apiRouter = express.Router()

apiRouter.get('/', function(req, res) {
    const absoluteInputPath = resolve(config.inputPath)
    const absoluteInputPathExists = fs.existsSync(absoluteInputPath)
    let absoluteInputPathCanRead = false
    let absoluteInputPathCanWrite = false
    if (absoluteInputPathExists) {
        try {
            fs.accessSync(absoluteInputPath, fs.constants.R_OK)
            absoluteInputPathCanRead = true
        } finally {}
        try {
            fs.accessSync(absoluteInputPath, fs.constants.W_OK)
            absoluteInputPathCanWrite = true
        } finally {}
    }
    const absoluteOutputPath = resolve(config.outputPath)
    const absoluteOutputPathExists = fs.existsSync(absoluteOutputPath)
    let absoluteOutputPathCanRead = false
    let absoluteOutputPathCanWrite = false
    if (absoluteOutputPathExists) {
        try {
            fs.accessSync(absoluteOutputPath, fs.constants.R_OK)
            absoluteOutputPathCanRead = true
        } finally {}
        try {
            fs.accessSync(absoluteOutputPath, fs.constants.W_OK)
            absoluteOutputPathCanWrite = true
        } finally {}
    }
    res.json({
        paths: {
            input: {
                path: absoluteInputPath,
                exists: absoluteInputPathExists,
                canRead: absoluteInputPathCanRead,
                canWrite: absoluteInputPathCanWrite
            },
            output: {
                path: absoluteOutputPath,
                exists: absoluteOutputPathExists,
                canRead: absoluteOutputPathCanRead,
                canWrite: absoluteOutputPathCanWrite
            }
        }
    })
})

module.exports = apiRouter