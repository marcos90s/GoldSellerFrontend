import { ApiService } from './../../services/api.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginResponse, UserProfile } from '../../core/auth.service';

interface LoginPayload{
  email: string;
  password: string;
}

interface ApiLoginResponse{
  token: string;
  userId: string;
  email: string;
  role: string;
  name?: string;
  type?: string;
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

  constructor( private apiService: ApiService, private router: Router, private authService: AuthService){}

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

    this.apiService.postData<LoginPayload, ApiLoginResponse>('/auth/login', payload)
    .subscribe({
      next: (response) =>{
        this.carregandoLogin = false;
        this.loginMessage = "Login realizado coam sucesso!";
        console.log('Login bem-sucedido! Resposta: ', response);
        console.log('Token recebido:', response.token);

        const userProfileData: UserProfile = {
          id: response.userId,
          name: response.name || this.extractNameFromEmail(response.email),
          email: response.email,
          role: response.role
        }

        const authServiceLoginData: LoginResponse ={
          token: response.token,
          user: userProfileData
        };

        this.authService.login(authServiceLoginData);
        console.log('Token e dados armazenados via AuthService.')

        this.router.navigate(['/users']);

      },
      error: (erro) => {

        this.carregandoLogin = false;
        this.loginEmail = '';
        this.loginPassword = '';
        this.erroLogin = erro.message;

        },
      complete: () => {
        this.carregandoLogin = false;
        console.log('Requisição de login completada.')
      }
    });
  }

  private extractNameFromEmail(email: string): string{
    if(email && email.includes('@')){
      return email.split('@')[0];
    }
    return '';
  }

  private limparMensagensLogin(): void{
    this.loginMessage = null;
    this.erroLogin = null;
  }
}
