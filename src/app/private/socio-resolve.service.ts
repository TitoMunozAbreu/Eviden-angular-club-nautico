import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Socio } from "./socio";
import { SocioService } from "./socio.service";

export const socioResolver: ResolveFn<Socio[]> = (
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
    ) => {
        return inject(SocioService).getSocios()
    }
    