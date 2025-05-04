import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { env } from '../env';
import { BaseService } from './base-service';
import { ILocation } from '../interfaces/entities/location';
import { IBaseResponse } from '../interfaces/shared/base-response';
import { IBaseRequest } from '../interfaces/shared/base-request';
import { IOptionsResponse } from '../interfaces/shared/options-response';

interface IGetLocationParams extends IBaseRequest {
    intitutionId: string | null | undefined
}

@Injectable({ providedIn: 'root' })
export class LocationService extends BaseService {
    constructor(override http: HttpClient) {
        super(http);
    }

    public getLocation(data: IGetLocationParams) {
        return this.get<IBaseResponse<ILocation[]>>({ api: env, href: '/location/get-location' }, data)
    }

    public getLocationOptions(data: Omit<IGetLocationParams,keyof IBaseRequest>) {
        return this.get<IBaseResponse<IOptionsResponse[]>>({ api: env, href: '/location/get-location-options' }, data)
    }

    public getLocationById(data: { locationId: number }) {
        return this.get<IBaseResponse<ILocation>>({ api: env, href: '/location/get-location-by-id' }, data)
    }

    public postLocation(data: Partial<{ name: string | null, description: string | null, insitutionId: string | null }>) {
        return this.post<IBaseResponse<any>>({ api: env, href: '/location/post-location' }, data)
    }

    public deleteLocation(params: { institutionId: string }): Observable<IBaseResponse<any>> {
        return this.delete<IBaseResponse<any>>({ api: env, href: `/location/delete-location` }, params)
    }
}
