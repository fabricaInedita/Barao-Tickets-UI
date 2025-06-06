import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { cookiesService } from '../services/cookies-service';
import { AUTH } from '../config/auth-config';
import { AuthenticationService } from '../services/authentication-service';
import { UserService } from '../services/user-service';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    public path: string;

    constructor(
        private router: Router,
        private userService: UserService
    ) {
        this.path = this.router.url;
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): boolean | Observable<boolean> | Promise<boolean> {
        const user = cookiesService.get("type");
        const token = cookiesService.get("accessToken");
        const expirationDate = cookiesService.get("expirationDateTimeAccessToken");
        const userClaims: string[] = route.data['claim'];

        console.log(
            token,
            state.url,
            expirationDate ? new Date(expirationDate) : new Date(),
            AUTH.DISABLE_AUTH,
            AUTH.AUTHORIZE_NOT_REQUIRED,
        )

        return AuthenticationService.validateSession(
            token,
            state.url,
            expirationDate ? new Date(expirationDate) : new Date(), 
            AUTH.DISABLE_AUTH,
            AUTH.AUTHORIZE_NOT_REQUIRED,
            (event): any => {
                console.log(event)
                
                if (event === "logout") {
                    this.router.navigate(['/login']);
                    this.userService.logout()
                }

                if (event === "authenticate") {
                    if (user && userClaims && !userClaims.includes(user) && state.url != '/') {
                        this.router.navigate(['/']);

                        return false;
                    }
                }

                if (event === "not-required") {

                }
            }
        );
    }

    setRoute() { }
} 
