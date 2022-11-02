export class Domicilio {
    id: number;
    direccion: string;
    nombre: string;
    telefono: string;
    usuario: string;

    constructor(id, direccion, nombre, telefono) {
        this.id = id;
        this.direccion = direccion;
        this.nombre = nombre;
        this.telefono = telefono;
    }

    
}