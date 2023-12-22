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
    //almacena el contador del autoLogut()
    private tokenExpirationTimer: any

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
                                    authData.expiresIn
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
                                            authData.expiresIn
                                        )
                                    }))
    }

    //metodo para el logout
    logout(){
        //pasar el usuario registrado a null
        this.user.next(null)
        this.route.navigate(['/auth'])
        //eliminar el usuario almacenado en el localStorage
        localStorage.removeItem('userData')
        //comprobar si existe el contador del autoLogut()
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer)
        }
        this.tokenExpirationTimer = null
       
    }

    //metodo para realizar el auto Login
    autoLogin(){
        //extraer el usuario del local storage 
        const userDataString = localStorage.getItem('userData')

        let tokenExpirationDate: Date
        let loadedUser: User
        //comprobar si es diferente de nulo
        if(userDataString !== null){            
            //casting a object
            const userData: {
                email: string,
                _token: string,
                role: string,
                _tokenExpirationDate: string} = JSON.parse(userDataString)
            //almacenar la fecha de expiracion del token
            tokenExpirationDate = new Date(userData._tokenExpirationDate)
            //inicializar el usuario con los datos de userData
            loadedUser = new User(userData.email, userData._token, userData.role, new Date(userData._tokenExpirationDate))
      
        }else{
            return 
        }
        //comprobar validez del token
        if(loadedUser.token){
            //subscribir el usuario
            this.user.next(loadedUser)
            //calcular la fecha de expiracion restante del token
            const date = new Date()
            const expirationDuration = (tokenExpirationDate.getTime()-3600000) - date.getTime()
            this.autoLogout(expirationDuration)
        }

    }

    //metodo para el autoLogout
    autoLogout(expirationDuration: number){        
        console.log(expirationDuration);             
        // Establecer un temporizador
      this.tokenExpirationTimer =  setTimeout(() => {
            this.logout();
        }, expirationDuration)       
  
         
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
                        expiresIn: string) {
        //fecha actual
        const date = new Date()                            
        //tiempo de expiracion
        const expirationDate = new Date(expiresIn)
        //tiempo restante
        const remainTime = expirationDate.getTime() - date.getTime()
        //inicializar el usuario autenticado
        const newUser = new User(email, token, role, new Date(expiresIn + 'Z'))   
        console.log(newUser);
        //subscribir el usuario 
        this.user.next(newUser)
        //iniciar el autoLogout
        this.autoLogout(remainTime)    
        //almacenar el usuario en el localStorage
        localStorage.setItem('userData', JSON.stringify(newUser))

    }
        
  
}