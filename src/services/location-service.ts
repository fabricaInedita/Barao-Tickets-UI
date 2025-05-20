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
    institutionId?: string | null | undefined | number
    locationId?: string | null | undefined | number
}

@Injectable({ providedIn: 'root' })
export class LocationService extends BaseService {
    constructor(override http: HttpClient) {
        super(http);
    }

    public getLocation(params: IGetLocationParams) {
        return this.get<IBaseResponse<ILocation[]>>({ api: env, href: '/location/get-location', params })
    }

    public updateLocation(params: Omit<IGetLocationParams, keyof IBaseRequest>, data: ILocation) {
        return this.put<IBaseResponse<ILocation>>({ api: env, href: '/location/update-location', params }, data)
    }

    public getLocationOptions(params: Omit<IGetLocationParams, keyof IBaseRequest>) {
        return this.get<IBaseResponse<IOptionsResponse[]>>({ api: env, href: '/location/get-location-options', params })
    }

    public getLocationById(params: Omit<IGetLocationParams, keyof IBaseRequest>) {
        return this.get<IBaseResponse<ILocation>>({ api: env, href: '/location/get-location-by-id', params })
    }

    public postLocation(data: Partial<{ name: string | null, description: string | null, insitutionId: string | null }>) {
        return this.post<IBaseResponse<any>>({ api: env, href: '/location/post-location' }, data)
    }

    public deleteLocation(params: Omit<IGetLocationParams, keyof IBaseRequest>): Observable<IBaseResponse<any>> {
        return this.delete<IBaseResponse<any>>({ api: env, href: `/location/delete-location` }, params)
    }
}
