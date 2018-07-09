# Overview
This prototype contains all necessary basic features to start up a NodeJS Typescript web-based game project inspired by [http://surviv.io/](http://surviv.io/)
It includes:

 - Network solution using [Websocket](https://github.com/websockets/ws)
 - [Server Reconciliation / Client-side Prediction](http://www.gabrielgambetta.com/client-side-prediction-server-reconciliation.html)
 - [Entity Interpolation](http://www.gabrielgambetta.com/entity-interpolation.html)
 - Messaging using Binary Array with [bit-buffer](https://github.com/inolen/bit-buffer)
 - Collision Detection using [SAT.js](https://github.com/jriecken/sat-js)
 - Rendering with [PixiJS](http://www.pixijs.com/)
 - [Webpack](https://webpack.js.org/) configurations for both client and server
 - Optional [Heroku](https://www.heroku.com/) configuration

# Installation
Make sure you have nodejs and npm installed.
Install all necessary packages with

    npm install

Then run:

    npm run build:dev
which should build server and client in the `dist/` folder.
To run the server:

    npm run start
   Then open a client at [https//localhost:8080/](https//localhost:8080/)   

 # Using Heroku
 package.json comes with all necessary commands to build the project on Heroku. When git pushed to Heroku, `heroku-postbuild` command is automatically called, building the project remotely with prod configuration.
 To set up your heroku project, [please follow the instruction here](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction)
 # Local Development
 Use the commands
 

    npm run watch:client
   and
   

    npm run watch:server
to automatically rebuild locally server and client while editing the typescript code.
