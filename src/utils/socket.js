import {io} from 'socket.io-client'
import {path} from '../constants/url'

// "undefined" means the URL will be computed from the `window.location` object
// const URL =
//   process.env.NODE_ENV === 'production'
//     ? undefined
//     : 'http://192.168.1.227:3000'

const local_backend = 'http://192.168.1.227:3000'
const test_jam = 'https://www.similantechnology.org:4433/pap_api_test/dist'

// export const socket = io(local_backend)
export const socket = io(local_backend)
// export const socket = io(path.JAM)

// var app = require('http').createServer(handler),
//   io = require('socket.io').listen(app)
// io.configure(function () {
//   io.set('transports', ['xhr-polling']) //Use long-polling instead of websockets!
//   io.set('resource', '/myApp/server.js') //Where we'll listen for connections.
// })
// app.listen(process.env.PORT)
// function handler(req, res) {
//   /*
//    *  Your code for handling non-websocket requests...
//    *  Note that Socket.IO will intercept any requests made
//    *  to myApp/server.js without calling this handler.
//    */
// }
