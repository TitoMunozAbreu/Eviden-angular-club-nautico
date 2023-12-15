import { Injectable, OnInit } from "@angular/core";
import { Socio } from "./socio";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, throwError } from "rxjs";

@Injectable({providedIn: "root"})
export class SocioService {

    baseURL = 'http://localhost:8080/api/v1/socios'
    socios!: Socio[]

    constructor(private http: HttpClient){}

    getSocios(){
        return this.http.get<Socio[]>(this.baseURL)
        .pipe(catchError(this.handleError))
    }

    //metodo para controlar los errores
    handleError(error: HttpErrorResponse){
        let errorMessage = 'An unknown error occured'
        //comprobar que exista un mensaje
        if(error.error.errorStatus === '404'){
            errorMessage = "No existen socios registrados"
            return throwError(() => { new Error(errorMessage)})
        }
        errorMessage =  error.error.message

        return throwError(() => new Error(errorMessage))
    }
    
}