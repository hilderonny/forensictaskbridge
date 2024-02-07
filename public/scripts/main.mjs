async function loadConfiguration() {
    const result = await fetch("/api/configuration")
    const config = await result.json()
    document.getElementById("inputPath").innerHTML = config.paths.input.path
    document.getElementById("inputPathExists").innerHTML = config.paths.input.exists ? '<span style="color:green">Exists</span>' : '<span style="color:red">Does not exist</span>'
    document.getElementById("inputPathCanRead").innerHTML = config.paths.input.canread ? '<span style="color:green">Readable</span>' : '<span style="color:red">Not readable</span>'
    document.getElementById("inputPathCanWrite").innerHTML = config.paths.input.canwrite ? '<span style="color:green">Writable</span>' : '<span style="color:red">Not writable</span>'
    document.getElementById("outputPath").innerHTML = config.paths.output.path
    document.getElementById("outputPathExists").innerHTML = config.paths.output.exists ? '<span style="color:green">Exists</span>' : '<span style="color:red">Does not exist</span>'
    document.getElementById("outputPathCanRead").innerHTML = config.paths.output.canread ? '<span style="color:green">Readable</span>' : '<span style="color:red">Not readable</span>'
    document.getElementById("outputPathCanWrite").innerHTML = config.paths.output.canwrite ? '<span style="color:green">Writable</span>' : '<span style="color:red">Not writable</span>'
}

const taskcolors = {
    "transcribe": "#8888FF",
    "translate": "#88FF88",
    "classifyimage": "FF88FF"
}

const statuscolors = {
    "waiting": "#FAFAFF",
    "running": "#FFFF00",
    "done": "#00FF00"
}

const clientinfos = {
    "::ffff:127.0.0.1": { "name" : "Seneca", "color": "#A7EEFA"},
    "::ffff:192.168.0.52": { "name" : "SY UPC Alt", "color": "#FF7F50"},
    "::ffff:192.168.0.151": { "name" : "RH UPC", "color": "#DAA520"},
    "::ffff:192.168.0.153": { "name" : "RH Workbook", "color": "#ADFF2F"},
    "::ffff:192.168.0.154": { "name" : "RH XMG", "color": "#A9A9A9"},
    "::ffff:192.168.0.156": { "name" : "RH BlueChip", "color": "#8888FF"},
}

async function loadTasks() {
    const result = await fetch("/api/tasks")
    const tasks = await result.json()
    const tableBody = document.getElementById("tasks")
    tableBody.innerHTML = ""
    tasks.sort((a, b) => {
        if (!a["startedat"]) return 1
        if (!b["startedat"]) return -1
        return a["startedat"] > b["startedat"] ? 1 : -1
    })
    for (const task of tasks) {
        const status = task["status"]
        const tr = document.createElement("tr")
        tableBody.appendChild(tr)
        // Id
        const idTd = document.createElement("td")
        idTd.innerHTML = task["id"]
        tr.appendChild(idTd)
        // Type
        const typeTd = document.createElement("td")
        var taskType = task["type"]
        typeTd.innerHTML = taskType
        typeTd.style.backgroundColor = taskcolors[taskType]
        tr.appendChild(typeTd)
        // Filename
        const filenameTd = document.createElement("td")
        var taskFilename = task["filename"]
        if (taskFilename && taskFilename.length > 5) {
            var lastpart = taskFilename.substring(taskFilename.length - 6)
            var color = `#${lastpart}`
            if (/^#[0-9A-F]{6}$/i.test(color)) {
                filenameTd.style.backgroundColor = color
            }
        }
        filenameTd.innerHTML = taskFilename
        tr.appendChild(filenameTd)
        // Status
        const statusTd = document.createElement("td")
        statusTd.innerHTML = status
        statusTd.style.backgroundColor = statuscolors[status]
        tr.appendChild(statusTd)
        // Duration
        const durationTd = document.createElement("td")
        var startedat = task["startedat"]
        if (status === "running" && startedat) {
            var diffsecs = Math.round((Date.now() - startedat) / 1000)
            var minutes = Math.floor(diffsecs / 60)
            var seconds = diffsecs - (minutes * 60)
            durationTd.innerHTML = `${("" + minutes).padStart(2, "0")}:${("" + seconds).padStart(2, "0")}`
            var factor = 4
            var green = Math.round(255 - diffsecs / factor)
            if (green < 0) green = 0
            var red = Math.round(diffsecs / factor)
            if (red > 255) red = 255
            var color = `rgb(${red},${green}, 0)`
            durationTd.style.backgroundColor = color
        }
        var createdat = task["createdat"]
        if (status === "waiting" && createdat) {
            var diffsecs = Math.round((Date.now() - createdat) / 1000)
            var minutes = Math.floor(diffsecs / 60)
            var seconds = diffsecs - (minutes * 60)
            durationTd.innerHTML = `${("" + minutes).padStart(2, "0")}:${("" + seconds).padStart(2, "0")}`
            var factor = 4
            var green = Math.round(255 - diffsecs / factor)
            if (green < 0) green = 0
            var red = Math.round(diffsecs / factor)
            if (red > 255) red = 255
            var color = `rgb(${red},${green}, 0)`
            durationTd.style.backgroundColor = color
        }
        var completedat = task["completedat"]
        if (status === "done" && completedat) {
            var diffsecs = Math.round((Date.now() - completedat) / 1000)
            var minutes = Math.floor(diffsecs / 60)
            var seconds = diffsecs - (minutes * 60)
            durationTd.innerHTML = `${("" + minutes).padStart(2, "0")}:${("" + seconds).padStart(2, "0")}`
            var factor = 4
            var green = Math.round(255 - diffsecs / factor)
            if (green < 0) green = 0
            var red = Math.round(diffsecs / factor)
            if (red > 255) red = 255
            var color = `rgb(${red},${green}, 0)`
            durationTd.style.backgroundColor = color
        }
        tr.appendChild(durationTd)
        // Remote address
        const remoteaddressTd = document.createElement("td")
        var remoteaddress = task["remoteaddress"]
        if (remoteaddress) {
            const clientDef = clientinfos[remoteaddress]
            if (clientDef) {
                remoteaddressTd.innerHTML = clientDef.name
                remoteaddressTd.style.backgroundColor = clientDef.color
            } else {
                remoteaddressTd.innerHTML = remoteaddress
            }
        }
        tr.appendChild(remoteaddressTd)
        // Actions
        const deleteActionTd = document.createElement("td")
        const deleteButton = document.createElement("button")
        deleteButton.innerHTML = "Delete"
        deleteButton.addEventListener("click", () => {
            if (window.confirm(`Really delete task ${task["id"]}?`)) {
                deleteTask(task["id"])
            }
        })
        deleteActionTd.appendChild(deleteButton)
        tr.appendChild(deleteActionTd)
        const detailsActionTd = document.createElement("td")
        if (status !== "done") {
            const detailsButton = document.createElement("button")
            detailsButton.innerHTML = "Details"
            detailsButton.addEventListener("click", () => { window.alert(JSON.stringify(task, null, "    ")) })
            detailsActionTd.appendChild(detailsButton)
        }
        tr.appendChild(detailsActionTd)
        const restartActionTd = document.createElement("td")
        if (status === "running") {
            const restartButton = document.createElement("button")
            restartButton.innerHTML = "Restart"
            restartButton.addEventListener("click", () => { restartTask(task["id"])})
            restartActionTd.appendChild(restartButton)
        }
        tr.appendChild(restartActionTd)
        const resultActionTd = document.createElement("td")
        if (status === "done") {
            const resultLink = document.createElement("a")
            resultLink.setAttribute("href", `/api/tasks/result/${task["id"]}`)
            resultLink.setAttribute("target", "_blank")
            resultLink.innerHTML = "Result"
            resultActionTd.appendChild(resultLink)
        }
        tr.appendChild(resultActionTd)
}
}

function load() {
    loadConfiguration()
    loadTasks()
    document.getElementById("time").innerHTML = new Date().toLocaleString()
}

async function restartTask(taskId) {
    fetch(`/api/tasks/restart/${taskId}`)
    loadTasks()
}

async function deleteTask(taskId) {
    fetch(`/api/tasks/remove/${taskId}`, { method: "DELETE" })
    loadTasks()
}

setInterval(load, 1000)
load()