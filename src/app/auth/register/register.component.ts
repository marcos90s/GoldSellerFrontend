import { ApiService } from './../../services/api.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { timeInterval } from 'rxjs';

interface RegisterPayload{
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse{
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ErroResponse{
  mensagem: string;
  erros?: any[];
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerName = '';
  registerEmail = '';
  registerPassword = '';

  registerMessage: string | null = null;
  erroRegister: string | null = null;
  loadgingRegister: boolean = false;

  constructor (private ApiService: ApiService, private router: Router){}

  realizeRegister(): void{
    console.log('Tentando realizar registro');
    this.limparMensagensRegister();
    this.loadgingRegister = true;

    if(!this.registerName ||!this.registerEmail || !this.registerPassword){
      this.erroRegister = 'Por favor, preencha todas as informações';
      this.loadgingRegister = false;
      return;
    }

    const payload: RegisterPayload = {
      name: this.registerName,
      email: this.registerEmail,
      password: this.registerPassword
    }

    this.ApiService.postData<RegisterPayload, RegisterResponse>('/auth/register', payload)
    .subscribe({
      next: (response) => {
        this.loadgingRegister = false;
        this.registerMessage = 'Usuário registrado';
        console.log('Registro bem sucedido! Resposta: ', response);
        setTimeout(()=>{
          this.router.navigate(['/login']);
        }, 3000);
      },
      //Fix error message
      error: (erro) => {
        this.loadgingRegister = false;
        if (erro && erro.error && typeof erro.error.mensagem === 'string') {
            this.erroRegister = erro.error.mensagem;
          } else if (typeof erro.message === 'string') {
            this.erroRegister = erro.message;
          } else {
            this.erroRegister = 'Falha no login. Verifique suas credenciais ou tente novamente mais tarde.';
          }
          this.erroRegister = 'Ops! Algo deu errado!'
          console.error('FALHA NO LOGIN! Detalhes do erro:', erro);
      },
      complete: () => {
        this.loadgingRegister = false;
        console.log('Requisição de registro completada.')
      }
    });
  }

  private limparMensagensRegister(): void{
    this.registerMessage = null;
    this.erroRegister = null;
  }

}
