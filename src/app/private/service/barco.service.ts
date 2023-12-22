import { Injectable } from "@angular/core";
import { ApiErrorResponse } from "../interface/api-error-response";
import { catchError, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn:"root"})
export class BarcoService {
    baseURL = 'http://localhost:8080/api/v1/barcos'

    constructor(private http: HttpClient){}

    actualizarBarco(barcoID: number, numeroMatricula: string , nombre: string, numeroAmarre: number , cuotaPago: number){
        return this.http.put<{mensaje: string}>(`${this.baseURL}/${barcoID}`, 
                            {
                                numeroMatricula: numeroMatricula,
                                nombre: nombre,
                                numeroAmarre: numeroAmarre,
                                cuotaPago: cuotaPago,                               
                            })
                .pipe(catchError(this.handleError))
    }

        //metodo para controlar los errores
        handleError(error: ApiErrorResponse){
        
            let errorMessage = 'An unknown error occured'
            //comprobar que exista un mensaje
            if(error.error.httpStatus === '404'){
                errorMessage = error.error.message
                return throwError(() => { new Error(errorMessage)})
            }
            errorMessage =  error.error.message
            
    
            return throwError(() => new Error(errorMessage))
        }
}