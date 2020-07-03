//requires
const express = require('express');

//lo usamos para trabajar con socket
const socketIO = require('socket.io');
const http =  require('http');

const path = require('path');

//inicializamos el express
const app = express();
//lo usamos para trabajar con socket
let server = http.createServer(app);

//Hacemos publica nuestra carpeta 'public'
const publicPath = path.resolve(__dirname, '../public');

//de la variable global process.env.PORT leemos el puerto que nos facilita Heroku cuando desplegemos la aplicación alli, o le asignamos el puerto 3000
const port = process.env.PORT || 3000;

//usamos el middleware para habilitar la carpeta publica
app.use(express.static(publicPath));

//IO = es la comunicación del  backend
//Exportamos el socket.io (server/sockets/socket.js)
module.exports.io = socketIO(server);
require('./sockets/socket');

//montamos nuestra plicación para que escuche por el puerto 'port'
//app.listen(port, (err) => {
//lo usamos para trabajar con socket
server.listen(port, (err) => {
    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ port }`);

});