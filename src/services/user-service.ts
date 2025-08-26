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
import { IBaseRequest } from '../interfaces/shared/base-request';
import { IUser } from '../interfaces/entities/user';

interface IGetUsersParams extends IBaseRequest {
    userId?: string | undefined | number | null;
}

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

                if (response.type == "admin") {
                    this.router.navigate(['/ticket-list']);
                }
                else {
                    this.router.navigate(['/home']);
                }

                return response;
            }),
            catchError(error => {

                throw error;
            })
        );
    }

    public forgotPassword(data: { email: string; }): Observable<any> {
        return this.post<any>({ api: env, href: '/user/forgot-password', params: {} }, data)
    }

    public signupAluno(data: { studentCode: string, name: string, password: string, confirmPassword: string }) {
        return this.post<any>({ api: env, href: '/user/post-student-user', params: {} }, data)
    }

    public signupColaborador(data: { email: string, name: string }) {
        return this.post<IBaseResponse<string>>({ api: env, href: '/user/post-admin-user', params: {} }, data)
    }

    public getColaborator(params: IGetUsersParams) {
        return this.get<any>({ api: env, href: '/user/get-admin-list', params },)
    }

    public deleteColaborator(params: { userId: string }) {
        return this.delete<any>({ api: env, href: '/user/delete-user' }, params)
    }

    public changePassword(data: { password: string, currentPassword: string }) {
        return this.patch<any>({ api: env, href: '/user/update-password', params: {} }, data)
    }

    public update(data: { userId: string, name: string }) {
        return this.patch<any>({ api: env, href: '/user/update-name', params: {} }, data)
    }

    public updateUser(params: Omit<IGetUsersParams, keyof IBaseRequest>, data: IUser) {
        return this.put<IBaseResponse<IUser>>({ api: env, href: '/user/update-user', params }, data)
    }

    public logout(): void {
        console.log("ok")

        const keys = Object.keys(Cookies.get());

        keys.forEach(e => {
            Cookies.remove(e);
        });

        this.router.navigate(['/login'])
    }

    public setEMail(params: { userId: string | number | null }, data: { receiveEmail: boolean }) {
        return this.patch<any>({ api: env, href: '/user/set-received-email', params: params }, data)
    }
}
