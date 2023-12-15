import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { User } from "./auth/user.model";

/* Interfaz para especificar definir los datos en la respuesta de autenticacion */
export interface AuthDataResponse {
    email: string
    token: string
    role: string
    expiresIn: string
}
// TODO handle logOut / autoLogin / auto Logout
@Injectable({providedIn: "root"})
export class AuthService {
    baseURL = 'http://localhost:8080/api/v2/auth'
    //usuario que iniciará la sesión
    user = new BehaviorSubject<User>(null as unknown as User)


    constructor(private http: HttpClient){}
    
    //metodo para el inicio de sesion
    login(email: string, password: string){
        //enviamos la peticion con la url y datos del usuario
        return this.http.post<AuthDataResponse>(`${this.baseURL}/authenticate`,
                                    {
                                        email: email,
                                        password: password
                                    })
                        .pipe(
                            //capturamos en caso de excepcion
                            catchError(this.handleError),
                            //gestionar la autenticacion del usuario
                            tap(authData => {
                                this.handleAuthentication(
                                    email,
                                    authData.token,
                                    authData.role,
                                    +authData.expiresIn
                                )
                            }))
    }

    //metodo para registro de usuario
    signUp(firstname:string , lastname: string ,email: string , password: string){
        //enviamos la peticion con la url y datos del usuario        
        return this.http.post<AuthDataResponse>(`${this.baseURL}/register`,
                                {
                                    firstname:firstname , 
                                    lastname: lastname ,
                                    email: email , 
                                    password: password,
                                    role: 'ADMIN'
                                })
                            .pipe(catchError(this.handleError),
                                    tap(authData => {
                                        this.handleAuthentication(
                                            email,
                                            authData.token,
                                            authData.role,
                                            +authData.expiresIn
                                        )
                                    }))
    }

    autoLogin(){
        
    }

    //metodo para controlar los errores
    handleError(error: HttpErrorResponse){
        let errorMessage =  'An unkwon error occured'
        //comprobar que exista un mensaje
        if(!error.error.message){
            return throwError(() => { new Error(errorMessage)})
        }
        errorMessage =  error.error.message

        return throwError(() => new Error(errorMessage))
    }

    //metodo para gestionar la autenticacion
    handleAuthentication(email: string,
                        token: string,
                        role: string,
                        expiresIn: number) {

        const user = new User(email, token, role, expiresIn)
        this.user.next(user)
        localStorage.setItem('userData', JSON.stringify(user))

    }
        
  
}