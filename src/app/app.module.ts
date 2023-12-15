import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { FormsModule } from '@angular/forms';
import { AuthInterceptor } from './auth/auth/auth-interceptor.service';

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
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
