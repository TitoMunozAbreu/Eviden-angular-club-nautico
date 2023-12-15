export interface Socio {
    nombre: string,
    apellidos: string,
    barcos?: [
        {
            nombre: string,
            numeroAmarre: number,
            cuotaPago: number
        }
    ]
}
