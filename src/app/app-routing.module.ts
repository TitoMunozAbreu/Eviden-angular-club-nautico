import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SocioComponent } from './private/socio/socio.component';
import { AuthComponent } from './auth/auth/auth.component';
import { SocioGuard } from './private/socio-guard.service';
import { socioResolver } from './private/socio-resolve.service';
import { SocioDetailComponent } from './private/socio/socio-detail/socio-detail.component';
import { SocioEditComponent } from './private/socio/socio-edit/socio-edit.component';
import { PageNotFoundComponent } from './public/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'socios', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'socios', component: SocioComponent,resolve: [socioResolver], canActivate: [SocioGuard],
    children:
      [
        { path: ':id', component: SocioDetailComponent}
      ]
  },
  { path: 'pageNotFound', component: PageNotFoundComponent},
  { path: '**', redirectTo: 'pageNotFound'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
