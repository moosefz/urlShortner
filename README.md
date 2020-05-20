# urlShortner
urlShortner using ExpressJS with RESTful Routing, NodeJS, MongoDB and Bootstrap.

## Getting Started
Ensure that you have a Node.js development environment installed with a connection to MongoDB (local or server). Download or clone this repository (urlShortner) to begin. You must install the following packages/modules for full functionality:

* express
* mongoose
* shortId
* ejs

These can all be downloaded in your node environment if NPM has been installed and configured using the following:

```
npm i express mongoose shortId ejs --save
```

Once setup, execute the server using:

```
node server.js
```

Listening is currently setup for the process.env OR a local host of port 3000 (can be changed in the app.listen() route). Console will notify once server is running. 

## Functionality
Input full size URLs (including 'https://') and the shortened URL will be returned in the table below. Each shortened URL is tracked via MongoDB along with a click counter. URLs are shortened using the *shortId* package found on npmjs.

## Built With
* Node.js 
* Express.js
* MongoDB
* shortId
* Bootstrap v4.4
