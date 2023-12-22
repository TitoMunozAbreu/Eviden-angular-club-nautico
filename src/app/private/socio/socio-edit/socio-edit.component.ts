import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, take } from 'rxjs';

import { SocioService } from '../../socio.service';
import { Barco } from '../../model/barco';
import { Socio } from '../../model/socio';
import { BarcoService } from '../../service/barco.service';

@Component({
  selector: 'app-socio-edit',
  templateUrl: './socio-edit.component.html',
  styleUrls: ['./socio-edit.component.scss']
})
export class SocioEditComponent implements OnInit {
  socioForm!: FormGroup;
  editMode = false
  socio!: Socio


  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private socioService: SocioService,
    private barcoService: BarcoService
  ) {}
  
  ngOnInit(): void {
    this.editMode = this.config.data.editMode 
    this.initForm()
  }

  /* Metodo para inicializar formulario */
  private initForm(){
    let socioDniNie = ''
    let socioNombre = ''
    let socioApellidos = ''
    let socioMovil = ''
    let socioEmail = ''
    let socioBarcos: any = []
    
    //comprobar si es editar socio
    if(this.editMode && this.config.data.socio){
      this.socio = this.config.data.socio
      socioNombre = this.socio.nombre ?? ''
      socioApellidos = this.socio.apellidos ?? ''
      socioMovil = this.socio.movil ?? ''
      socioEmail = this.socio.email ?? ''

      if(this.socio['barcos']){
        for(let b of this.socio.barcos){
          socioBarcos.push(
            this.fb.group({
              id: [b.id],
              numeroMatricula: [b.numeroMatricula, [Validators.required]], 
              nombre: [b.nombre, [Validators.required, Validators.pattern('^[^<>]+$')]],
              numeroAmarre: [b.numeroAmarre, [Validators.required, Validators.pattern(/^\d{1,3}$/)]], 
              cuotaPago: [b.cuotaPago, [Validators.required, Validators.pattern('^\\d{1,3}(\\.\\d{1,2})?$')]], 
            })
          )
        }
      }
    }

    //definir formulario
    this.socioForm = this.fb.group({
      dniNie: [socioDniNie, [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,9}$')], [this.existeDniNie.bind(this)]],
      nombre: [socioNombre, [Validators.required, Validators.pattern('^[^<>]+$')]],
      apellidos: [socioApellidos, [Validators.required, Validators.pattern('^[^<>]+$')]],
      movil: [socioMovil, [Validators.required, Validators.pattern(/^\d{9}$/)]],
      email: [socioEmail, [Validators.required, Validators.email, Validators.pattern('.*@club-nautico\.com')], [this.existeEmail.bind(this)]],
      barcos: this.fb.array(socioBarcos)
    })

  }

  /* metodo para registrar formulario */
  onSubmit() {

    if(this.editMode && this.socio){
      this.handleEditarSocio()
           
    }else{
      this.handleCrearSocio()
    }

  }

  //metodo gestiona la editacion de un socio
  handleEditarSocio(){
    let msjSocioActualizado!: string

    //actualizar los datos del socio segun el formulario
    this.socio.nombre = this.socioForm.get('nombre')?.value
    this.socio.apellidos = this.socioForm.get('apellidos')?.value
    this.socio.movil = this.socioForm.get('movil')?.value
    this.socio.email = this.socioForm.get('email')?.value
    this.socio.barcos = this.socioForm.get('barcos')?.value
    //enviar actualizacion del socio en el backend
    this.socioService.actualizarSocio(+this.socio.id,
                                      this.socio.nombre,
                                      this.socio.apellidos,
                                      this.socio.movil,
                                      this.socio.email).subscribe({
      next: response => {
        //almacenar msj de la respuesta
        msjSocioActualizado = response.mensaje
        //notifico que la lista de socios ha cambiado
        this.socioService.sociosChanged.next(true)       
        
          //iterar sobre la lista de barcos
        for(let barco of this.socio.barcos){
          //comprobar si existen barcos
          if(barco){
            //enviar actualizacion del barco al backend
            this.barcoService.actualizarBarco(barco.id, 
              barco.numeroMatricula, 
              barco.nombre, 
              barco.numeroAmarre, 
              barco.cuotaPago).subscribe({
                next: response => {
                  console.log(response);        
                },error: errorResp => {
                  console.log(errorResp);
                  
                }
              })
          }
        }
        //cerrar dynamicDialog
        this.ref.close({
          msj: msjSocioActualizado
        })    
      },error: errorResp => {
        console.log(errorResp);        
      }
    })
  
  }

  //metodo que gestiona la creacion de un socio
  handleCrearSocio(){
    let msjSocioCreado!: string

    //almacenar los datos introducidos en formulario
    const dniNie = this.socioForm.get('dniNie')?.value
    const nombre = this.socioForm.get('nombre')?.value
    const apellidos = this.socioForm.get('apellidos')?.value
    const movil = this.socioForm.get('movil')?.value
    const email = this.socioForm.get('email')?.value
    let barcos: Barco[] = this.socioForm.get('barcos')?.value
    //comprobar que no existan barcos
    if(!barcos){
      barcos = []
    }      
    //enviar creacion de usuario al backend
    this.socioService.crearSocio(dniNie,nombre,apellidos,movil,email,barcos)
    .subscribe({
      next: respData => {
        //almacenar msj de la respuesta
        msjSocioCreado = respData.mensaje
        //notifico que la lista de socios ha cambiado
        this.socioService.sociosChanged.next(true)
        //cerrar dynamicDialog
        this.ref.close({
          msj: msjSocioCreado
        })
      },
      error: respError => {
        console.log(respError)
        
      }
    })
  }

  cerrarModal(){
    this.ref.close()
  }

  /* metodo para añadir barco al socioForm */
  addBarco(){
    (this.socioForm.get('barcos') as FormArray).push(
      this.fb.group({
        numeroMatricula: ['', [Validators.required]], 
        nombre: ['', [Validators.required, Validators.pattern('^[^<>]+$')]],
        numeroAmarre: ['', [Validators.required, Validators.pattern(/^\d{1,3}$/)]], 
        cuotaPago: ['', [Validators.required, Validators.pattern('^\\d{1,3}(\\.\\d{1,2})?$')]], 
      })
    )
  }

  /* metodo para eliminar un barco de la lista de socioForm */
  eliminarBarco(index: number){
    (this.socioForm.get('barcos') as FormArray).removeAt(index)
  }

  //validador dni async
  existeDniNie(control: FormControl): Promise<any> | Observable<any> {
    //establecer una promesa
    const promise = new Promise((resolve, reject) => {
      //comprobar al backend la existencia del dni
      this.socioService.existeDniNie(control.value)
      .pipe(take(1))
      .subscribe({
        next: data => {         
            //comprobar que exista
            if(data.existeDniNie){
              resolve({'existeDniNie': true})     
            }else{
              resolve(null)
            }
        }
      })        
    })
    return promise
  }

  //validador email async
  existeEmail(control: FormControl): Promise<any> | Observable<any> {
    //establecer una promesa
    const promise = new Promise((resolve, reject) => {
      //comprobar al backend la existencia del email
      this.socioService.existeEmail(control.value)
      .pipe(take(1))
      .subscribe({
        next: data => {      
            //comprobar que exista
            if(data.existeEmail){
              resolve({'existeEmail': true})     
            }else{
              resolve(null)
            }
        }
      })        
    })
    return promise
  }
  /* metodo para validar el array de barcos del socioForm */
  validarBarco(campo: string, index: number): boolean | undefined{
    const formGroup = this.controls[index] as FormGroup
    return !formGroup.get(campo)?.valid && formGroup.get(campo)?.touched
  }

  /* metodo para validar si el campo es requerido */
  validarCampoBarcoRequired(campo: string, index: number): boolean{
    const formGroup = this.controls[index] as FormGroup
    return formGroup.get(campo)?.errors?.['required']
  }
    /* metodo para validar si el campo posee un patron de expresion regular*/
    validarCampoBarcoPattern(campo: string, index: number): boolean{
      const formGroup = this.controls[index] as FormGroup
      return formGroup.get(campo)?.errors?.['pattern']
    }
  /* metodo devuelve la lista de barcos */
  get controls(){
    return (this.socioForm.get('barcos') as FormArray).controls
  }

}