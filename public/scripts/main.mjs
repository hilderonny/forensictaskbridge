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
    tableBody.innerHTML = tasks.map(task => `<tr>${["id", "type", "filename", "inprogress"].map(key => `<td>${task[key]}</td>`).join("")}</tr>`).join("")
}

loadConfiguration()
loadTasks()