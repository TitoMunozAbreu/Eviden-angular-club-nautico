import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { Socio } from "./model/socio";
import { SocioService } from "./socio.service";
import { ApiResponse } from "./interface/api-response";
import { Page } from "./interface/page";

export const socioResolver: ResolveFn<Page> = (
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
    ) => {
        return inject(SocioService).getSocios()
    }
    