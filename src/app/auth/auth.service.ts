import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { User } from "./auth/user.model";
import { Router } from "@angular/router";

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
    user = new BehaviorSubject<User|null>(null)


    constructor(private http: HttpClient,
                private route: Router){}
    
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

    logout(){
        this.user.next(null)
        this.route.navigate(['/auth'])
        localStorage.removeItem('userData')
    }

    autoLogin(){
        //extraer datos del local storage 
        const userDataString = localStorage.getItem('userData')
        let loadedUser: User
        if(userDataString !== null){            
            //cast to JSON.paser
            const userData: {email: string,
                _token: string,
                role: string,
                expiresIn: number} = JSON.parse(userDataString)
            loadedUser = new User(userData.email, userData._token, userData.role, userData.expiresIn)
        }else{
            return 
        }
        //TODO CHECK la fecha de expiracion del token
        
        this.user.next(loadedUser)


  
        
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

        const newUser = new User(email, token, role, expiresIn)
        this.user.next(newUser)
        localStorage.setItem('userData', JSON.stringify(newUser))

    }
        
  
}