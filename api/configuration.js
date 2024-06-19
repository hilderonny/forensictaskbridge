/**
 * @api {get} /api/configuration Request configuration
 * @apiVersion 1.0.0
 * @apiName GetConfiguration
 * @apiGroup Configuration
 * 
 * @apiSuccess {Object}   paths                  Path settings
 * @apiSuccess {Object}   paths.input            Information about the input path where the server receives tasks to process
 * @apiSuccess {String}   paths.input.path       Absolute path on server
 * @apiSuccess {Boolean}  paths.input.exists     "true" when the path exists on the server or "false", when not
 * @apiSuccess {Boolean}  paths.input.canread    "true" when the path can be read by the server or "false", when not
 * @apiSuccess {Boolean}  paths.input.canwrite   "true" when the path can be written by the server or "false", when not
 * @apiSuccess {Object}   paths.output           Information about the output path where the server puts task results
 * @apiSuccess {String}   paths.output.path      Absolute path on server
 * @apiSuccess {Boolean}  paths.output.exists    "true" when the path exists on the server or "false", when not
 * @apiSuccess {Boolean}  paths.output.canread   "true" when the path can be read by the server or "false", when not
 * @apiSuccess {Boolean}  paths.output.canwrite  "true" when the path can be written by the server or "false", when not
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "paths": {
 *             "input": {
 *                 "path": "/data/input",
 *                 "exists": true,
 *                 "canread": true,
 *                 "canwrite": false,
 *             },
 *             "output": {
 *                 "path": "/data/output",
 *                 "exists": true,
 *                 "canread": true,
 *                 "canwrite": true,
 *             }
 *         }
 *     }
 */

const express = require("express")
const fs = require("fs")
const {resolve} = require("path")

const apiRouter = express.Router()

apiRouter.get('/', function(req, res) {
    const absoluteInputPath = resolve(process.env.INPUTPATH)
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
    const absoluteOutputPath = resolve(process.env.OUTPUTPATH)
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
                canread: absoluteInputPathCanRead,
                canwrite: absoluteInputPathCanWrite
            },
            output: {
                path: absoluteOutputPath,
                exists: absoluteOutputPathExists,
                canread: absoluteOutputPathCanRead,
                canwrite: absoluteOutputPathCanWrite
            }
        }
    })
})

module.exports = apiRouter