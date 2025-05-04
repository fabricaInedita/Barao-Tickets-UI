import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { env } from '../env';
import { BaseService } from './base-service';
import { ILocation } from '../interfaces/entities/location';
import { IBaseResponse } from '../interfaces/shared/base-response';
import { IBaseRequest } from '../interfaces/shared/base-request';

interface IGetLocationRequest extends IBaseRequest {
    intitutionId: string | null | undefined
}

@Injectable({ providedIn: 'root' })
export class LocationService extends BaseService {
    constructor(override http: HttpClient) {
        super(http);
    }

    public getLocation(data: IGetLocationRequest | Omit<BaseService, keyof IBaseRequest>): Observable<IBaseResponse<ILocation[]>> {
        return this.get<IBaseResponse<ILocation[]>>({ api: env, href: '/location/get-location' }, data)
            .pipe(
                map(response => response),
                catchError(error => {

                    throw error;
                })
            );
    }

    public getLocationById(data: { locationId: number }): Observable<IBaseResponse<ILocation>> {
        return this.get<IBaseResponse<ILocation>>({ api: env, href: '/location/get-location-by-id' }, data)
            .pipe(
                map(response => response),
                catchError(error => {

                    throw error;
                })
            );
    }

    public postLocation(data: Partial<{ name: string | null, description: string | null, insitutionId: string | null }>): Observable<IBaseResponse<any>> {
        return this.post<IBaseResponse<any>>({ api: env, href: '/location/post-location' }, data)
            .pipe(
                map(response => response),
                catchError(error => {

                    throw error;
                })
            );
    }

    public deleteLocation(params: { institutionId: string }): Observable<IBaseResponse<any>> {
        return this.delete<IBaseResponse<any>>({ api: env, href: `/location/delete-location` }, params)
            .pipe(
                map(response => response),
                catchError(error => {

                    throw error;
                })
            );
    }
}
