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

async function loadTasks() {
    const result = await fetch("/api/tasks")
    const tasks = await result.json()
    const tableBody = document.getElementById("tasks")
    tableBody.innerHTML = ""
    tasks.sort((a, b) => {
        if (!a["completedat"]) return -1
        if (!b["completedat"]) return 1
        return a["completedat"] > b["completedat"] ? -1 : 1
    })
    for (const task of tasks) {
        const status = task["status"]
        const tr = document.createElement("tr")
        tableBody.appendChild(tr)
        for (const key of ["id", "type", "filename", "status", "completedat"]) {
            const td = document.createElement("td")
            td.innerHTML = task[key]
            tr.appendChild(td)
            if (key === "filename") {
                var filename = task[key]
                if (filename && filename.length > 5) {
                    var lastpart = filename.substring(filename.length - 6)
                    var color = "#" + lastpart
                    if (/^#[0-9A-F]{6}$/i.test(color)) {
                        td.style.backgroundColor = color
                    }
                }
            }
        }
        const actionTd = document.createElement("td")
        tr.appendChild(actionTd)
        if (status !== "done") {
            const detailsButton = document.createElement("button")
            detailsButton.innerHTML = "Details"
            detailsButton.addEventListener("click", () => { window.alert(JSON.stringify(task, null, "    ")) })
            actionTd.appendChild(detailsButton)
        }
        if (status === "running") {
            const restartButton = document.createElement("button")
            restartButton.innerHTML = "Restart"
            restartButton.addEventListener("click", () => { restartTask(task["id"])})
            actionTd.appendChild(restartButton)
        }
        else if (status === "done") {
            const resultLink = document.createElement("a")
            resultLink.setAttribute("href", `/api/tasks/result/${task["id"]}`)
            resultLink.setAttribute("target", "_blank")
            resultLink.innerHTML = "Result"
            actionTd.appendChild(resultLink)
        }
        const deleteButton = document.createElement("button")
        deleteButton.innerHTML = "Delete"
        deleteButton.addEventListener("click", () => { deleteTask(task["id"]) })
        actionTd.appendChild(deleteButton)
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