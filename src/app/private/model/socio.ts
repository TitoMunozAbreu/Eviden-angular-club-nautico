import { Barco } from './barco'

export class Socio {
    public id: string
    public documentoIdentidad?: string
    public nombre: string
    public apellidos: string
    public movil: string
    public email: string
    public barcos: Barco []

    constructor(
        id: string,
        nombre: string,
        apellidos: string,
        movil: string,
        email: string,
         barcos: Barco [],
         documentoIdentidad?: string
       
    ){  
        this.id = id
        this.documentoIdentidad =  documentoIdentidad
        this.nombre= nombre
        this.apellidos= apellidos
        this.movil= movil
        this.email= email
        this.barcos = barcos
    }
}
