import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  //garante que o serviço é um singleton e tree-shakable disponivel em toda app
  providedIn: 'root'
})
export class ApiService {

  //endereço api backend
  private apiUrl = 'http://localhost:8080'

  // Construtor onde o HttpClient é injetado.
  // 'private http: HttpClient' cria uma propriedade privada 'http'
  // e automaticamente atribui a instância do HttpClient a ela.
  constructor(private http: HttpClient, private router: Router) { }

  public getData<T>(endpoint: string, params?: HttpParams, customHeaders?: HttpHeaders): Observable<T>{
    //monta URL completa
    const url = `${this.apiUrl}${endpoint}`;

    const options = {
      params: params,
      headers: customHeaders
    };
    console.log('ApiService: Fazendo GET para', url, 'com options:', options);
    //Faz a requisição GET
    return this.http.get<T>(url, options) 
    //pipe encadeia os operadores da biblioteca rxjs
    .pipe(
    //map pode ser usado para transformar a resposta, aqui apenas a repassa.
      map((response: T) => response),
    //Intercepta erros da requisição
      catchError(this.handleError)
    );
  }

  public postData<T, U>(endpoint: string, data: T, options?:{headers?: HttpHeaders}): Observable<U>{
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.post<U>(url, data, options)
    .pipe(
      map((response: U)=> response),
      catchError(error => this.handleError(error))
    );
  }

  public updateData<T_Payload, T_Response>(baseEndpoint: string, id: string, payload: T_Payload, customHeaders?: HttpHeaders): Observable<T_Response>{
    //Monta a URL
    const url = `${this.apiUrl}${baseEndpoint}/${id}`;
    const options = {headers: customHeaders};

    console.log(`ApiService: PUT request to ${url} with payload:`,payload);
    return this.http.put<T_Response>(url, payload, options).pipe(catchError(this.handleError));
  }

  public deleteData<T_Response>(baseEndpoint: string, id: string, customHeaders?: HttpHeaders): Observable<T_Response>{
    const url = `${this.apiUrl}${baseEndpoint}/${id}`;
    const options = {headers: customHeaders};

    console.log(`ApiService: DELETE request to ${url}`);
    return this.http.delete<T_Response>(url, options).pipe(catchError(this.handleError))
  }


  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    if(error.error instanceof ErrorEvent){
      //Erro do lado do cliente ou rede
      errorMessage = `Erro do cliente: ${error.error.message}`
    }else if(error instanceof HttpErrorResponse){
      errorMessage = `${error.error.message}`;
      if(error.status === 401 || error.status === 403){
        errorMessage = `${error.error.message}`
      }
    }
    console.warn(`Status: ${error.status} - ${errorMessage}`);

    return throwError(() => new Error(errorMessage));
  }
}
