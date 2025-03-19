import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { env } from '../env';
import { BaseService } from './base-service';
import { useErrors } from '../utils/hooks/errors-hook';
import { ITicket } from '../interfaces/entities/ticket';
import { IBaseResponse } from '../interfaces/shared/base-response';

@Injectable({ providedIn: 'root' })
export class TicketService extends BaseService {
    constructor(override http: HttpClient) {
        super(http);
    }

    public postTicket(data: any): Observable<any> {
        return this.post<any>({ api: env, href: '/ticket/post-ticket' }, data)
            .pipe(
                map(response => response),
                catchError(error => {
                    
                    throw error;
                })
            );
    }

    public getTickets(params: any): Observable<IBaseResponse<ITicket[]>> {
        return this.get<any>({ api: env, href: '/ticket/get-ticket' }, params)
            .pipe(
                map(response => response),
                catchError(error => {
                    
                    throw error;
                })
            );
    }

    public getTicketById(params: { ticketId: string }): Observable<IBaseResponse<ITicket>> {
        return this.get<any>({ api: env, href: `/ticket/get-ticket-by-id` }, params)
            .pipe(
                map(response => response),
                catchError(error => {
                    
                    throw error;
                })
            );
    }
}