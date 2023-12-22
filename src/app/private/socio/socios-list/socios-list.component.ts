import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { MessageService } from 'primeng/api';

import { Socio } from '../../model/socio';
import { SocioService } from '../../socio.service';
import { Observable, Subscription } from 'rxjs';
import { Page } from '../../interface/page';
import { SocioEditComponent } from '../socio-edit/socio-edit.component';

@Component({
  selector: 'app-socios-list',
  templateUrl: './socios-list.component.html',
  styleUrls: ['./socios-list.component.scss'],
  providers:[MessageService]
})
export class SociosListComponent implements OnInit, OnDestroy{
  socios$!: Observable<Page>
  subscripcion!: Subscription
  socios!: Socio[]
  errorMessage = null
  numberOfElements!: number
  totalElements!: number
  totalPages!: number
  page !: number
  offset !: number

  constructor(private socioService: SocioService,
              private ref: DynamicDialogRef,
              private dialogService: DialogService,
              private cdr: ChangeDetectorRef,
              private messageService: MessageService){}

  ngOnInit(): void {
    //obtener listado de socios
    this.socios$ =  this.socioService.getSocios()
    //metodo que gestiona el observable socio$
    this.handleObservable(this.socios$)    
    //me subscribo si existen cambios en la lista
    this.subscripcion = this.socioService.sociosChanged.subscribe({
      next: data => {
        //comprabar que devuelva true
        if(data){
          //obtener listado de socios
          this.socios$ =  this.socioService.getSocios()
          this.handleObservable(this.socios$)
        }
      }
    })
  }

  /* metodo para gestionar los eventos de la paginacion */
  onPageChange(event: any){
    this.page = (event.first / event.rows) + 1;
    //enviar el numero de pagina  al backend
    this.socios$ = this.socioService.getSocios('',this.page)
    //metodo que gestiona el observable socios$
    this.handleObservable(this.socios$)

  }

  /*  metodo para buscar socio segun el nombre */
  buscarSocio(event: any){
    //almacenar la palabra a buscar
    const buscarNombre = event.target.value
    //enviar el nombre del socio al backend
    this.socios$ = this.socioService.getSocios(buscarNombre)
    //metodo que gestiona el observable socios$
    this.handleObservable(this.socios$)
  }
  
  //metodo que gestiona los observables
  handleObservable(socios$: Observable<Page>){
    socios$.subscribe(
      {
        next: respData => {    
          console.log(respData);
          this.socios = respData.content     
          this.numberOfElements = respData.numberOfElements
          this.totalElements = respData.totalElements
          this.totalPages = respData.totalPages
          this.page = respData.pageable.pageSize
          this.offset = respData.pageable.offset
                    
        },
        error: error => {
          this.errorMessage = error
        }
      }
    )
  }
  //metodo para crear socio, dynamicDialog
  onCrearSocioModal(){
    this.cdr.detectChanges()
    this.ref = this.dialogService.open(SocioEditComponent, {
      header: 'Crear Socio',
      width: '30%',
      data: {editMode: false},
      contentStyle: {"max-height": "500px", "overflow": "auto"},
      baseZIndex: 10000      
      })
    //subscribirme al  dynamicDialog cuando cierra
      this.ref.onClose.subscribe({
      next: data => {
        if(data){
          this.showInfo(data.msj)
        }          
      }
    })
    
      
  }

  showError(errorMensaje: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMensaje });
  }

  showInfo(infoMensaje: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: infoMensaje });
  }

  ngOnDestroy(): void {
      if(this.ref){
        this.ref.close()
      }
      this.subscripcion.unsubscribe()
  }


}
