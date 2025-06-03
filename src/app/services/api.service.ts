import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  constructor(private http: HttpClient) { }

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
      catchError(this.handleError)
    );
  }



  private handleError(error: any): Observable<never> {
    console.error('Ocorreu um erro na API:', error); // Loga o erro no console
    // Poderia também formatar o erro para o usuário ou enviá-lo para um serviço de logging
    return throwError(() => new Error(error)); // Relança o erro para o chamador do serviço
  }
}
