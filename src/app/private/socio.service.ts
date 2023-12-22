import { Injectable, OnInit } from "@angular/core";
import { Socio } from "./model/socio";
import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Subject, catchError, throwError } from "rxjs";

import { Page } from "./interface/page";
import { Barco } from "./model/barco";
import { ApiErrorResponse } from "./interface/api-error-response";

@Injectable({providedIn: "root"})
export class SocioService {
    sociosChanged = new Subject<boolean>
    baseURL = 'http://localhost:8080/api/v1/socios'
    socios!: Socio[]
   

    constructor(private http: HttpClient){}

    getSocios(name:string = '', page:number = 0,  size: number = 5){
        let pageParams = new HttpParams()
        pageParams = pageParams.append("nombre", name)
        pageParams = pageParams.append("page", page)
        pageParams = pageParams.append("size", size)

        return this.http.get<Page>(this.baseURL, 
            {
                params: pageParams
            })
        .pipe(catchError(this.handleError))
    }

    crearSocio(dniNie: string ,nombre: string ,apellidos: string, movil: string ,email: string, barcos?: Barco[]){
        return this.http.post<{mensaje: string}>(`${this.baseURL}`, 
                        {
                            documentoIdentidad: dniNie,
                            nombre: nombre,
                            apellidos: apellidos,
                            movil: movil,
                            email: email,
                            barcos: barcos
                        })
                .pipe(catchError(this.handleError))
    }

    actualizarSocio(socioID: number, nombre: string ,apellidos: string, movil: string ,email: string){
        return this.http.put<{mensaje: string}>(`${this.baseURL}/${socioID}`, 
                            {
                                nombre: nombre,
                                apellidos: apellidos,
                                movil: movil,
                                email: email,                               
                            })
                .pipe(catchError(this.handleError))

    }

    eliminarSocio(socioID: number){
        return this.http.delete<{mensaje: string}>(`${this.baseURL}/${socioID}`)
                .pipe(catchError(this.handleError))
    }

    getSocio(socioID: number){
        return this.http.get<Socio>(`${this.baseURL}/${socioID}`)
                .pipe(catchError(this.handleError))
    }


    existeDniNie(dniNIe: string){
        let pageParams = new HttpParams()
        pageParams = pageParams.append("dniNie", dniNIe)

       return this.http.get<{existeDniNie:boolean}>(`${this.baseURL}/existeDniNie`, 
                                {
                                    params: pageParams
                                })
                .pipe(catchError(this.handleError))
    }

    existeEmail(email: string){
        let pageParams = new HttpParams()
        pageParams = pageParams.append("email", email)

       return this.http.get<{existeEmail:boolean}>(`${this.baseURL}/existeEmail`, 
                                {
                                    params: pageParams
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