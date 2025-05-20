import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { env } from '../env';
import { BaseService } from './base-service';
import { useErrors } from '../utils/hooks/errors-hook';
import { IInstitution } from '../interfaces/entities/institution';
import { IBaseResponse } from '../interfaces/shared/base-response';
import { IOptionsResponse } from '../interfaces/shared/options-response';
import { IBaseRequest } from '../interfaces/shared/base-request';

interface IGetInstituitionParams extends IBaseRequest {
    institutionId?: string | null | undefined
}

@Injectable({ providedIn: 'root' })
export class InstitutionService extends BaseService {
    constructor(override http: HttpClient) {
        super(http);
    }

    public getInstitution(params: IGetInstituitionParams) {
        return this.get<IBaseResponse<IInstitution[]>>({ api: env, href: '/institution/get-institution', params })
    }

    public getInstitutionOptions(params?: Omit<IGetInstituitionParams, keyof IBaseRequest>) {
        return this.get<IBaseResponse<IOptionsResponse[]>>({ api: env, href: '/institution/get-institution-options' })
    }

    public postInstitution(data: { name: string, cep: string }) {
        return this.post<IBaseResponse<any>>({ api: env, href: '/institution/post-institution' }, data)
    }

    public deleteInstitution(params: { institutionId: string }) {
        return this.delete<IBaseResponse<any>>({ api: env, href: `/institution/delete-institution` }, params)
    }

    public updateInstituition(params:  Omit<IGetInstituitionParams, keyof IBaseRequest>, data: IInstitution) {
        return this.put<IBaseResponse<IInstitution>>({ api: env, href: '/institution/update-institution', params }, data)
    }
}
