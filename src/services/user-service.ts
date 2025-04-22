import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import Cookies from 'js-cookie';
import { env } from '../env';
import { BaseService } from './base-service';
import { useErrors } from '../utils/hooks/errors-hook';
import { Router } from '@angular/router';
import { IBaseResponse } from '../interfaces/shared/base-response';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {
    constructor(
        override http: HttpClient,
        private router: Router

    ) {
        super(http);
    }

    public loginPost(data: { username: string; password: string }): Observable<any> {
        return this.post<any>({ api: env, href: '/user/user-login', params: {} }, {
            username: data.username,
            password: data.password
        }).pipe(
            map((response) => {
                const keys = Object.keys(response);

                keys.forEach(e => {
                    const value = typeof response[e] === 'object' ? JSON.stringify(response[e]) : response[e];

                    Cookies.set(e, value, { expires: Number(response.expirationTimeAccessToken) });
                });

                this.router.navigate(['/home']);

                return response;
            }),
            catchError(error => {

                throw error;
            })
        );
    }

    public signupAluno(data: { studentCode: string, name: string, password: string, confirmPassword: string }) {
        return this.post<any>({ api: env, href: '/user/post-student-user', params: {} }, data)
    }

    public signupColaborador(data: { email: string, name: string }) {
        return this.post<IBaseResponse<string>>({ api: env, href: '/user/post-admin-user', params: {} }, data)
    }

    public getColaborator() {
        return this.get<any>({ api: env, href: '/user/get-admin-list' },)
    }

    public deleteColaborator(params: { userId: string }) {
        return this.delete<any>({ api: env, href: '/user/delete-user' }, params)
    }

    public changePassword(data: { password: string, currentPassword: string }) {
        return this.patch<any>({ api: env, href: '/user/update-password', params: {} }, data)
    }

    public logout(): void {
        console.log("ok")

        const keys = Object.keys(Cookies.get());

        keys.forEach(e => {
            Cookies.remove(e);
        });

        this.router.navigate(['/login'])
    }
}
