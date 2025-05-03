import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AUTH } from '../config/auth-config';
import { useErrors } from '../utils/hooks/errors-hook';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsService } from './utils-service';

export interface Route {
  api: string
  href: string
  params?: any
}

export abstract class BaseService {
  private _snackBar = inject(UtilsService);

  constructor(
    protected http: HttpClient
  ) { }

  protected post<T>(route: Route, body: any, progressEventCallback?: (progress: ProgressEvent) => void): Observable<T> {
    return this.http.post<T>(this.route(route), body, this.config())
      .pipe(
        catchError(error => {
          useErrors(error, this._snackBar);
          return throwError(() => error);
        })
      );
  }

  protected patch<T>(route: Route, body: any): Observable<T> {
    return this.http.patch<T>(this.route(route), body, this.config()).pipe(
      catchError(error => {
        useErrors(error, this._snackBar);
        return throwError(() => error);
      })
    );
  }

  protected get<T>(route: Route, params?: any): Observable<T> {
    route.params = params;

    return this.http.get<T>(this.route(route), { ...this.config() }).pipe(
      catchError(error => {
        useErrors(error, this._snackBar);
        return throwError(() => error);
      })
    );
  }

  protected put<T>(route: Route, body: any): Observable<T> {
    return this.http.put<T>(this.route(route), body, this.config()).pipe(
      catchError(error => {
        useErrors(error, this._snackBar);
        return throwError(() => error);
      })
    );
  }

  protected delete<T>(route: Route, params?: any): Observable<T> {
    route.params = params;

    return this.http.delete<T>(this.route(route), { ...this.config() }).pipe(
      catchError(error => {
        useErrors(error, this._snackBar);
        return throwError(() => error);
      })
    );
  }

  private route(route: Route): string {
    return `${route.api}${route.href}${this.urlParams(route.params)}`;
  }

  protected urlParams(params: any) {
    if (params) {
      const keys = Object.keys(params)
      if (keys.length > 0) {
        const stringParams = keys.map(e => {
          if ((typeof params[e] == "string" && params[e] != null && params[e]?.trim() != "")) {
            if (Array.isArray(params[e])) {
              return params[e].map(i => {
                if (params[e] != null && params[e] != undefined) {
                  return e + "=" + i
                }

                return null
              }).filter(item => item != null).join("&");
            }
            else {
              if (params[e] != null && params[e] != undefined) {
                return e + "=" + params[e]
              }

              return null
            }
          }
          else {
            if (Array.isArray(params[e])) {
              return params[e].map(i => {
                if (params[e] != null && params[e] != undefined) {
                  return e + "=" + i
                }

                return null
              }).filter(item => item != null).join("&");
            }
            else {
              if (params[e] != null && params[e] != undefined) {
                return e + "=" + params[e]
              }

              return null
            }
          }
        });

        return "?" + stringParams.filter(e => e != null).join("&")
      }
    }

    return ""
  }

  private config(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: AUTH.DEFAULT_AUTHORIZATION_TOKEN()
      })
    };
  }
}
