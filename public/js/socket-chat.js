//Aquí definiremos las funciones que se dispararan cuando enviemos o recibamos información del servidor
// on son para escuchar información
// emit para enviar o emitir información

// io() lo inicializamos en  server/sockets/socket.js
var socket = io()

//Para recuperar los parámetros de búsqueda
var params = new URLSearchParams( window.location.search );

//si en la URl no tenemos el parámetro "nombre" o "sala"
if (!params.has('nombre') || !params.has('sala')) {
	window.location = 'index.html';//retornamos al index
	//Lanzamos una excepción de Error. Sería como colocar un return, pero como no estoy dentro de una función uso el throw new Error
	throw new Error('El nombre y la sala son necesarios');
}

//recuperamos el valor del parámetro "nombre"
var usuario = {
	nombre : params.get('nombre'),
	sala : params.get('sala'),
};


//Función para establecer un canal de comunicación abierto con el server.
 socket.on('connect', function() {
	console.log('Conectado con el servidor');

	//para emitir un mensaje al servidor que el usuario entro al chat
	//usuario que recibimos por la URL
	//function(respuesta) callback para recibir lista de usuarios conectados o un mensaje de error por no enviar el usuario
	socket.emit('entrarChat', usuario, function(respuesta){
		//console.log('Usuarios conectados ', respuesta);
		//llamamos a la función renderizarUsuarios() de public/js/socket-chat-jquery.js
		renderizarUsuarios(respuesta);
	});

});

//Función para saber si perdimos comunicación con el server.
 socket.on('disconnect', function() {
	console.log('Perdimos conexión con el servidor');
});


 //socket.emit('enviarMensaje',  {
	//nombre: 'Henry',
	//mensaje: 'Hola mundo'
//'callback' para verificar que la información llego al server
//'respuesta' nos indica si llego la propiedad 'nombre' del objeto 'data' al server
//}, function(respuesta) {
	//console.log('Respuesta Server:', respuesta)
//});

//Función para recibir información desde el server
//'crearMensaje' es el nombre del evento que se envio desde el server
//'mensaje' es el objeto que enviamos desde el server
socket.on('crearMensaje', function (mensaje)  {
	//console.log('Respuesta Server:', mensaje);
	//llamamos a la función renderizarMensajes() y scrollBottom() de public/js/socket-chat-jquery.js
	renderizarMensajes(mensaje, false);
    scrollBottom();
});

//Función para saber cuando un usuario entra o sale del chat
//'listaPersona' es el nombre del evento que se envio desde el server
//'personas' es el objeto que enviamos desde el server
socket.on('listaPersona', function (personas)  {
	//console.log(personas);
	//llamamos a la función renderizarUsuarios() de public/js/socket-chat-jquery.js
	renderizarUsuarios(respuesta);
});

//Mensajes privados
socket.on('mensajePrivado', function (mensaje)  {
	console.log('Mensaje Privado:', mensaje);
});