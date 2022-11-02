export class Pago {
    id: number;
    fecha: string;
    totalPago: string;
    items: string;
    usuario: string;

    constructor(id, fecha, totalPago, items, usuario) {
        this.id = id;
        this.fecha = fecha;
        this.totalPago = totalPago;
        this.items = items;
        this.usuario = usuario;
    }

    
}