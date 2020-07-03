
/* EJEMPLO DEL OBJETO USUARIO
el 'id' es el que nos proporciona socket-io
{
	id: 'asdasdasdasd-87878',
	nombre: 'Henry',
	sala: 'Deportes'
}

	una estrucutura parecida tiene el arreglo de persoans del constructor de la clase
*/
class Usuarios {

	constructor(){
		//arrgelo de personas conectadas a la aplicación
		this.personas = [];
	}

	//agregar una persona al chat
	agregarPersona(id, nombre, sala){

		//creo un objeto con los datos de la persona 
		let persona = {id, nombre, sala};

		//agrego la persona a la propiedad(arreglo) personas
		this.personas.push(persona);

		//retornamos a la propiedad(arreglo) personas
		return this.personas;
	}

	//obtener una persona
	getPersona(id){

		//Buscamos a la persona en la propiedad(arreglo) personas
		//El método filter() crea un nuevo array con todos los elementos que cumplan la condición implementada por la función dada.
		let persona = this.personas.filter( persona => persona.id === id)[0];//[0] lo usamos porque filter devuelve un arreglo y necesitamos la primera posición de ese arreglo
	
		return persona;
	}

	//retornamos todas las personas de la propiedad(arreglo) personas
	getPersonas(){
		return this.personas;
	}

	//obtener las personas por sala
	getPersonasPorSala(sala){
		let personasEnSala = this.personas.filter( persona => persona.sala === sala);
		return personasEnSala;
	}

	//eliminar a una persona de la propiedad(arreglo) personas
	borrarPersona(id){

		//obtenemos los datos de la persona que vamos a borrar
		let personaBorrada = this.getPersona(id);

		//personas con 'id' diferente al que estoy pasando al método borrarPersona(id)
		this.personas = this.personas.filter(persona =>  persona.id != id );

		//retornamos la persona borrada
		return personaBorrada
	}
}

module.exports = {
	Usuarios
} 