import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, take } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Injectable({providedIn: "root"})
export class SocioGuard implements CanActivate{

    constructor(private authService: AuthService,
                private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.authService.user.pipe(
            //solo llama una sola vez al usuario
            take(1),
            map(user => {
                const isAuth = !!user;
                //comprueba si user existe
                if (isAuth) {
                    return true;
                }
                //redirigir en caso de no autenticado
                return this.router.createUrlTree(['/auth']);
            })
        );
    }


}