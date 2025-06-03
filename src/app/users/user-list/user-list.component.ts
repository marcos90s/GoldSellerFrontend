import { HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiService } from './../../services/api.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface UsersBackResponse {
  id: string;
  name:string;
  email: string;
  role: string;
  totalGold: number | null;
  totalMoney: number | null;
  realTransactionIds: string[];
  gameTransactionIds: string[];
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit{

  responseData: UsersBackResponse[] | null = null;
  loading: boolean = false;
  erroApi: string | null = null;
  tokenIsPresent: boolean = true;

  searchEmail: string = '';
  feedbackMessage: string | null = null;

  constructor(private ApiService: ApiService, private router: Router){}
  
  ngOnInit(): void {    
    this.getAllUsers();   
  }

  getAllUsers(): void{
    this.loading = true;
    this.erroApi = null;
    this.responseData = null;

    const token = localStorage.getItem('MeuAppToken');
    let headers;
    if (!token) {
      this.erroApi = "Autenticação necessária.";
      this.loading = false;
      return;
    } else {
      headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    let params;

    if(this.searchEmail && this.searchEmail.trim() !== ''){
      params = new HttpParams().set('email', this.searchEmail.trim());
      this.feedbackMessage = `Buscando por: ${this.searchEmail.trim()}`;
    }else{
      this.feedbackMessage = 'Carregando todos os usuários...'
    }

    this.ApiService.getData<UsersBackResponse[]>('/users', params, headers)
    .subscribe({
      next: (response) => {
        this.responseData = response;
        if(this.searchEmail && this.searchEmail.trim() !== '' && response.length === 0){
          this.feedbackMessage = `Nenhum usuário encontrado com o email: ${this.searchEmail.trim()}`
        }else if(!this.searchEmail || this.searchEmail.trim() === ''){
          this.feedbackMessage = response.length > 0 ? `Exibindo ${response.length} usuário(s).` : "Nenhum usuário cadastrado.";
        }else if(response.length > 0){
          this.feedbackMessage = `Encontrado(s) ${response.length} usuário(s) para: ${this.searchEmail.trim()}`;
        }

        this.loading = false;
        console.log('Dados recebidos: ', this.responseData);
      },
      error: (erro) =>{
        this.loading = false;
        if(erro.staus === 401 || erro.status === 403){
          this.erroApi = 'Não autorizado ou token inválido/expirado. Tente fazer login novamente.'

        }else if(erro.error && erro.error.mensagem){
          this.erroApi = erro.error.mensagem;
        }else{
          this.erroApi = `Fala ao buscar os dados: ${erro.message}`
        }
      }
    })
  }

  executeSearch(): void{
    this.getAllUsers();
  }

  showAll(): void {
    this.searchEmail = '';
    this.getAllUsers();
  }


}
