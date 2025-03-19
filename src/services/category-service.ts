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

@Injectable({ providedIn: 'root' })
export class CategoryService extends BaseService {
    constructor(override http: HttpClient) {
        super(http);
    }

    public getTicketCategories(params?: any): Observable<IBaseResponse<ICategoryTicket[]>> {
        return this.get<IBaseResponse<ICategoryTicket[]>>({ api: env, href: '/category/get-ticket-category', }, params)
            .pipe(
                map(response => response),
                catchError(error => {
                    
                    throw error;
                })
            );
    }

    public getCategory(params?: any): Observable<IBaseResponse<ICategory[]>> {
        return this.get<IBaseResponse<ICategory[]>>({ api: env, href: '/category/get-category' }, params)
            .pipe(
                map(response => response),
                catchError(error => {
                    
                    throw error;
                })
            );
    }

    public postTicketCategory(data: { description: string }): Observable<IBaseResponse<any>> {
        return this.post<IBaseResponse<any>>({ api: env, href: '/category/post-category' }, data)
            .pipe(
                map(response => response),
                catchError(error => {
                    
                    throw error;
                })
            );
    }

    public deleteCategory(params: { categoryId: number }): Observable<IBaseResponse<any>> {
        return this.delete<IBaseResponse<any>>({ api: env, href: `/category/delete-category` }, params)
            .pipe(
                map(response => response),
                catchError(error => {
                    
                    throw error;
                })
            );
    }
}
