//Asignamos por Destructuring 
const { io} = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

//Instanciamos la clase usuarios
const usuarios = new Usuarios();

//Verificar conexión con el cliente
io.on('connection', (client) => {
	
	console.log('Usuario conectado');

	//para recibir un mensaje del cliente con el usuario que entro al chat
	//callback función para verificar la retroalimentanción (server/cliente).
	client.on('entrarChat', (usuario, callback) => {
		
		//si no recibo el nombre del usuario
		if (!usuario.nombre || !usuario.sala) {
			return callback({
				error: true,
				mensaje: 'El nombre y la sala son necesarios'
			});
		}
		
		//Para incluir un usuario a una sala
		client.join(usuario.sala);

		//agregamos el usuario al chat
		//client.id = id de socket-io
		usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);

		//cada vez que alguien entra o sale de una misma sala se les notifica a los integrantes de la misma
		client.broadcast.to(usuario.sala).emit('listaPersona', usuarios.getPersonasPorSala(usuario.sala));

		//retornamos los usuarios conectados a una misma sala
		callback(usuarios.getPersonasPorSala(usuario.sala));
	});

	//Para recibir el mensaje que envio el cliente y enviarselo a todos los clientes
	client.on('crearMensaje', (data) => {
		//obtenemos los datos del usuario que envio el mensaje
		let persona = usuarios.getPersona(client.id);
		//crearMensaje(data.nombre,data.mensaje)=>función ../utilidades/utilidades
		let mensaje = crearMensaje(persona.nombre,data.mensaje);
		//enviamos el mensaje que creamos a todos los usuarios conectados a una misma sala
		client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

	});

	//para desconectar a un usuarios del chat. Este evento no hace falta llamarlo desde el cliente para que funcione
	client.on('disconnect', () => {

		//eliminamos el usuario del chat
		//client.id = id de socket-io
		let personaBorrada = usuarios.borrarPersona(client.id);

		//Emitimos un mensaje al cliente para informar acerca del usuario de una misma sala que se desconecto
		//client.broadcast.emit('crearMensaje', { usuario: 'Administrador', mensaje: `${personaBorrada.nombre} abandonó el chat`});
		//emit('crearMensaje')=>evento
		//crearMensaje('Administrador')=>función ../utilidades/utilidades
		client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador',`${ personaBorrada.nombre } abandonó el chat`));
		//cada vez que alguien entra o sale del chat de una misma sala
		client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));

	});

	//Mensajes privados
	client.on('mensajePrivado', data => {

		let persona = usuarios.getPersona(client.id);
		//crearMensaje(data.nombre,data.mensaje)=>función ../utilidades/utilidades
		client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre,data.mensaje));

	});

});