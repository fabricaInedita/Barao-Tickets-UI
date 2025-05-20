import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { env } from '../env';
import { BaseService } from './base-service';
import { useErrors } from '../utils/hooks/errors-hook';
import { ICategoryTicket } from '../interfaces/entities/category-ticket';
import { ICategory } from '../interfaces/entities/category';
import { IBaseResponse } from '../interfaces/shared/base-response';
import { IOptionsResponse } from '../interfaces/shared/options-response';
import { IBaseRequest } from '../interfaces/shared/base-request';

interface IGetTicketParams extends IBaseRequest {
    categoryId?: string | null | undefined | number
}

@Injectable({ providedIn: 'root' })
export class CategoryService extends BaseService {
    constructor(override http: HttpClient) {
        super(http);
    }

    public getTicketCategories(params?: any) {
        return this.get<IBaseResponse<ICategoryTicket[]>>({ api: env, href: '/category/get-ticket-category', params })
    }

    public getCategory(params: IGetTicketParams) {
        return this.get<IBaseResponse<ICategory[]>>({ api: env, href: '/category/get-category', params })
    }

    public getCategoryOptions(params?: Omit<IGetTicketParams, keyof IBaseRequest>) {
        return this.get<IBaseResponse<IOptionsResponse[]>>({ api: env, href: '/category/get-ticket-category-options', params })
    }

    public postTicketCategory(data: { description: string }) {
        return this.post<IBaseResponse<any>>({ api: env, href: '/category/post-category' }, data)
    }

    public deleteCategory(params: Omit<IGetTicketParams, keyof IBaseRequest>) {
        return this.delete<IBaseResponse<any>>({ api: env, href: `/category/delete-category` }, params)
    }

    public updateCategory(params: Omit<IGetTicketParams, keyof IBaseRequest>, data: ICategory) {
        return this.put<IBaseResponse<ICategory>>({ api: env, href: '/category/update-category', params }, data)
    }
}
