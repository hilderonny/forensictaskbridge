# forensictaskbridge
PHP application for retrieving forensic analysis tasks from clients and distributing them to worker machines.

## Overview

This server application is used for the forensic analysis of files. It receives files and a description what to do with the files from different client programs like:

- [IPED audio translation task](https://github.com/hilderonny/iped-audiotranslatetask) (Not implemented yet)
- [IPED image classification task](https://github.com/hilderonny/iped-imageclassificationtask) (Not implemented yet)

It also servers for different worker programs which can handle the files and perform the tasks like:

- [Background media translator](https://github.com/hilderonny/background-media-translator) (Not implemented yet)
- [Background text translator](https://github.com/hilderonny/background-text-translator) (Not implemented yet)
- [Image classificator](https://github.com/hilderonny/image-classificator) (Not implemented yet)

The clients put their files to process into a shared directory and call an API endpoint to inform the server about the new task.

The server then remembers the files and tasks. When now a worker asks the server whether it has a specific task to to, the server tells the worker where it can find the file and marks the task to be in progress by a worker.

When the worker finishs it reports the results to the server. When now a client asks for the status of the task it gets the result back.

## Installation

First you need to have Apache2 and PHP installed. On Windows XAMPP is a good solution.

Next download this repository, for example to `D:\forensictaskbridge`.

Add an alias to this directory in your Apache2 configuration file.

```
<IfModule alias_module>
    Alias /forensictaskbridge "D:/forensictaskbridge"
    <Directory "D:/forensictaskbridge">
        Options Indexes FollowSymLinks Includes ExecCGI
        AllowOverride All
        Require all granted
    </Directory>
</IfModule>
```

Restart Apache2 and you should be able to open the dashboard via `http://<YOURSERVERURL>/forensictaskbridge`.
