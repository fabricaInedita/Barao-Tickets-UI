import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { env } from '../env';
import { BaseService } from './base-service';
import { useErrors } from '../utils/hooks/errors-hook';
import { ITicket } from '../interfaces/entities/ticket';
import { IBaseResponse } from '../interfaces/shared/base-response';
import { IOptionsResponse } from '../interfaces/shared/options-response';
import { IBaseRequest } from '../interfaces/shared/base-request';

interface IGetTicketsParams extends IBaseRequest {

}

@Injectable({ providedIn: 'root' })
export class TicketService extends BaseService {
    constructor(override http: HttpClient) {
        super(http);
    }

    public postTicket(data: any): Observable<any> {
        return this.post<any>({ api: env, href: '/ticket/post-ticket' }, data)
    }

    public proccessTicket(params: { ticketId: string | number | null }, data: { status: boolean }) {
        return this.patch<any>({ api: env, href: '/ticket/process-ticket', params: params }, data)
    }

    public getTickets(params: IGetTicketsParams): Observable<IBaseResponse<ITicket[]>> {
        return this.get<any>({ api: env, href: '/ticket/get-ticket', params })
    }

    public getTicketsOptions(params: Omit<IGetTicketsParams, keyof IGetTicketsParams>): Observable<IBaseResponse<IOptionsResponse[]>> {
        return this.get<any>({ api: env, href: '/ticket/get-ticket-options', params })
    }

    public getTicketById(params: { ticketId: string }): Observable<IBaseResponse<ITicket>> {
        return this.get<any>({ api: env, href: `/ticket/get-ticket-by-id`, params })
    }

    public getReport(params: any) {
        return this.download({
            api: env,
            href: `/ticket/generate-report`,
            params
        });
    }
}