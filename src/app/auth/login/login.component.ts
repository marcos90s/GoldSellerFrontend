import { ApiService } from './../../services/api.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface LoginPayload{
  email: string;
  password: string;
}

interface LoginResponse{
  token: string;
  userId: string;
  email: string;
  role: string;
  type: string
}

interface ErroReponse{
  mensagem: string;
  erros?: any[];
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginEmail = '';
  loginPassword = '';

  loginMessage: string | null = null;
  erroLogin: string | null = null;
  carregandoLogin: boolean = false;

  constructor( private ApiService: ApiService, private router: Router){}

  realizarLogin(): void {
    console.log('tentando realizar login com: ', this.loginEmail);
    this.limparMensagensLogin();
    this.carregandoLogin = true;
    
    if(!this.loginEmail || !this.loginPassword){
      this.erroLogin = 'Por favor, preencha o email e a senha';
      this.carregandoLogin = false;
      return;
    }

    const payload: LoginPayload = {
      email: this.loginEmail,
      password: this.loginPassword
    };

    this.ApiService.postData<LoginPayload, LoginResponse>('/auth/login', payload)
    .subscribe({
      next: (resposta) =>{
        this.carregandoLogin = false;
        this.loginMessage = "Login realizado com sucesso!";
        console.log('Login bem-sucedido! Resposta: ', resposta);
        console.log('Token recebido:', resposta.token);

        localStorage.setItem('MeuAppToken', resposta.token);

        alert('Login realizado com sucesso! Token: '+resposta.token);
        this.loginEmail = '';
        this.loginPassword = '';
      },
      error: (erro) => {
      this.carregandoLogin = false;
          // O 'erro' aqui pode ser um HttpErrorResponse.
          // A mensagem de erro real do backend pode estar em erro.error.mensagem
          if (erro && erro.error && typeof erro.error.mensagem === 'string') {
            this.erroLogin = erro.error.mensagem;
          } else if (typeof erro.message === 'string') {
            this.erroLogin = erro.message;
          } else {
            this.erroLogin = 'Falha no login. Verifique suas credenciais ou tente novamente mais tarde.';
          }
          console.error('FALHA NO LOGIN! Detalhes do erro:', erro);
        },
      complete: () => {
        this.carregandoLogin = false;
        console.log('Requisição de login completada.')
      }
    });
  }

  private limparMensagensLogin(): void{
    this.loginMessage = null;
    this.erroLogin = null;
  }
}
