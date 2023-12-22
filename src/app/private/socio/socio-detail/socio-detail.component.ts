import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Socio } from '../../model/socio';
import { SocioService } from '../../socio.service';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SocioEditComponent } from '../socio-edit/socio-edit.component';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-socio-detail',
  templateUrl: './socio-detail.component.html',
  styleUrls: ['./socio-detail.component.scss'],
  providers: [MessageService]
})
export class SocioDetailComponent implements OnInit, OnDestroy {
  socio$!: Observable<Socio>
  subscripcion!: Subscription
  id!: number
  socio!: Socio
  visible: boolean = false



  constructor(private socioService: SocioService,
              private route: ActivatedRoute,
              private router: Router,
              private messageService: MessageService,
              private dialogService: DialogService,
              private ref: DynamicDialogRef){}

  ngOnInit(): void {
    //me subscribo a la ruta 
    this.route.params.subscribe({
      next: param => {
        this.id = +param['id']
        //obtener el socio segun id
        this.socio$ = this.socioService.getSocio(this.id)
        //metodo que gestiona el observable socio$
        this.hanldeObservable(this.socio$)
      }
    }) 
    //me subscribo si existen cambios en el socio actual
   this.subscripcion = this.socioService.sociosChanged.subscribe({
      next: data => {
        //comprueba si es true
        if(data){
          this.socio$ = this.socioService.getSocio(this.id)
          //metodo que gestiona el observable socio$
          this.hanldeObservable(this.socio$)
        }
      }
    })     
  }

  //metodo para editar socio, dynamicDialog
  editarSocio(){
    //abrir modal
    this.ref = this.dialogService.open(SocioEditComponent, {
      header: 'Editar Socio',
      width: '30%',
      data: {
        //confirmo que es para editar socio y le paso el socio actual
        editMode: true,
        socio: this.socio
      },
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      baseZIndex: 10000    
    })
    //subscribirme al  dynamicDialog cuando cierra
    this.ref.onClose.subscribe({
      next: data => {
        //comprobar si existe datos de vuelta
        if(data){
          this.socio = data.socioActualizado          
          this.showInfo(data.msj)          
        }
      }
    })
    //destruir modal
    this.ref.onDestroy.subscribe(() => {
      console.log('Modal destroyed');
    });

  }
  //metodo para eliminar socio
  eliminarSocio(){
    this.socioService.eliminarSocio(+this.socio.id).subscribe({
      next: response => {
        if(response){
          this.onConfirm()
          //notifica al subject los cambios realizados en la lista
          this.socioService.sociosChanged.next(true)
          //volver a la ruta anterior
          this.router.navigate(['/socios'])            
        }
      },
      error: errorResponse => {
        if(errorResponse){
            this.showError(errorResponse)
        }
      }
    })
  }
  
  //metodo para el toast confirm
  onConfirm() {
    this.messageService.clear('confirm');
    this.visible = false;
  }
  //metodo para definir el contenido del toast confirm
  showConfirm() {
    if (!this.visible) {
        this.messageService.add({ key: 'confirm', sticky: true, severity: 'danger', summary: `Estas seguro de eliminar el socio: ${this.socio.nombre} ?` });
        this.visible = true;
    }
  }
  //metood en caso de cancelar
  onReject() {
    this.messageService.clear('confirm');
    this.visible = false;
  }

  //metodo para mostrar el toast
  showError(errorMensaje: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMensaje });
  }

  showInfo(infoMensaje: string) {
    this.messageService.add({key: 'info', severity: 'info', summary: 'Info', detail: infoMensaje });
  }


  hanldeObservable(socio$: Observable<Socio>){
    socio$.subscribe({
      next: socio => {  
        //comprobar que existe
        if(socio){              
          this.socio = socio             
        }                 
      },
      error: errorResp => {
        //mostar mensaje de error
        this.showError(errorResp)
      }
    })
  }

  ngOnDestroy(): void {
    if(this.ref){
      this.ref.close()
    }
      this.subscripcion.unsubscribe()
  }


}
