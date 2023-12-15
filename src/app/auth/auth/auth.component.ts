import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthDataResponse, AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { __values } from 'tslib';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
// formulario de autenticacion
  @ViewChild('authForm') authForm !: NgForm
  error = null
  isLoading = false
  isLoginMode = true

  constructor(private authService: AuthService,
              private router: Router){}

  // metodo para Login o Sign up
  onSubmit(){
    //almacenar los datos de autenticacion
    const email = this.authForm.value.email
    const password = this.authForm.value.password
    const firstname = this.authForm.value.firstname
    const lastname = this.authForm.value.lastname

    let authObs: Observable<AuthDataResponse>
    //mostrar loading-spinner
    this.isLoading = true
    //comprobar si es Login
    if(this.isLoginMode){
      authObs =  this.authService.login(email, password)
    }else {
      authObs = this.authService.signUp(firstname, lastname, email, password)
    }
    //subscribirme a la respuesta del login o registro
    authObs.subscribe({
      next: authResp => {
        //TODO navegar hacia lista socios
        this.router.navigate(['/socios'])
        this.isLoading = false
      },
      error: errorMesagge => {
        this.error = errorMesagge;
        this.isLoading = false     
      }
    })

    
    
  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode
  }

  

}
