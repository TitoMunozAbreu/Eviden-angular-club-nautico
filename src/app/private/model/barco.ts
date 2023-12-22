export class Barco {
    id:number
    numeroMatricula!: string
    nombre!: string
    numeroAmarre!: number
    cuotaPago!: number
    socioID?: number

    constructor(
        id:number,
        numeroMatricula: string,
        nombre: string,
        numeroAmarre: number,
        cuotaPago: number,
        socioID?: number
    ){
        this.id = id
        this.numeroMatricula = numeroMatricula
        this.nombre = nombre
        this.numeroAmarre = numeroAmarre
        this.cuotaPago = cuotaPago
        this.socioID = socioID
    }
}