# forensictaskbridge

Web application for retrieving forensic analysis tasks from clients and distributing them to worker machines.

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

First you need to have NodeJS installed (https://nodejs.org/en/download).

On Linux you can do it with:

```
curl -fsSL https://deb.nodesource.com/setup_21.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
```

Next download this repository, for example to `D:\forensictaskbridge`.

Now open a command line in this directory and install the required dependencies.

```
npm ci
```

## Development

For developing purposes simply open the directory in Visual Studio Code and use the "Debug" command.

## ApiDoc

The API documentation can be found locally at the SubUrl `/apidoc` or online at https://hilderonny.github.io/forensictaskbridge/. To generate it, install `apidoc` as global dependency and run the following command from a command line (not Powershell).
The apidoc is not part of the repository itself.

```
npm run apidoc
```

## Running on Linux

Make sure to allow access to the desired port (here `30000`) through your firewall.

```
sudo ufw allow 30000
```

Create a SystemD configuration file at ` /etc/systemd/system/forensictaskbridge.service` with this content.

```
[Unit]
Description=Forensic Task Bridge

[Service]
ExecStart=/usr/bin/node /forensictaskbridge/server.js
Restart=always
User=user
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
Environment=PORT=30000
WorkingDirectory=/forensictaskbridge/

[Install]
WantedBy=multi-user.target
```

Start the background process by

```
sudo systemctl daemon-reload
sudo systemctl start forensictaskbridge
sudo systemctl enable forensictaskbridge
```