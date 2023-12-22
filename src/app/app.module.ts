import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastModule } from 'primeng/toast';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { SocioComponent } from './private/socio/socio.component';
import { SociosListComponent } from './private/socio/socios-list/socios-list.component';
import { SocioItemComponent } from './private/socio/socios-list/socio-item/socio-item.component';
import { SocioDetailComponent } from './private/socio/socio-detail/socio-detail.component';
import { CapitalLetterPipe } from './private/socio/capital-letter.pipe';
import { AuthComponent } from './auth/auth/auth.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './auth/auth/auth-interceptor.service';
import { SocioEditComponent } from './private/socio/socio-edit/socio-edit.component';
import { PageNotFoundComponent } from './public/page-not-found/page-not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SocioComponent,
    SociosListComponent,
    SocioItemComponent,
    SocioDetailComponent,
    CapitalLetterPipe,
    AuthComponent,
    LoadingSpinnerComponent,
    SocioEditComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    DialogModule,
    DynamicDialogModule,
    ButtonModule,
    NgxPaginationModule,
    PaginatorModule,
    InputTextModule,
    ToastModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    DialogService, 
    DynamicDialogRef, 
    DynamicDialogConfig, 
    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
