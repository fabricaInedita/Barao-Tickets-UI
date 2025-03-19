import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { env } from '../env';
import { BaseService } from './base-service';
import { useErrors } from '../utils/hooks/errors-hook';
import { IInstitution } from '../interfaces/entities/institution';
import { IBaseResponse } from '../interfaces/shared/base-response';

@Injectable({ providedIn: 'root' })
export class InstitutionService extends BaseService {
    constructor(override http: HttpClient) {
        super(http);
    }

    public getInstitution(): Observable<IBaseResponse<IInstitution[]>> {
        return this.get<IBaseResponse<IInstitution[]>>({ api: env, href: '/institution/get-institution' })
            .pipe(
                map(response => response),
                catchError(error => {
                    
                    throw error;
                })
            );
    }

    public postInstitution(data: { name: string, cep: string }): Observable<IBaseResponse<any>> {
        return this.post<IBaseResponse<any>>({ api: env, href: '/institution/post-institution' }, data)
            .pipe(
                map(response => response),
                catchError(error => {
                    
                    throw error;
                })
            );
    }

    public deleteInstitution(params: { institutionId: string }): Observable<IBaseResponse<any>> {
        return this.delete<IBaseResponse<any>>({ api: env, href: `/institution/delete-institution` }, params)
            .pipe(
                map(response => response),
                catchError(error => {
                    
                    throw error;
                })
            );
    }
}
