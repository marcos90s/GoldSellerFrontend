import { ApiService } from './core/services/api.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from "./auth/login/login.component";
import { HomeComponent } from "./home/home.component";
import { HeaderComponent } from "./layout/header/header.component";

interface UsersBackResponse {
  id: string;
  name:string;
  email: string;
  role: string;
  totalGold: number;
  totalMoney: number;
  realTransactionIds: string[];
  gameTransactionIds: string[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, LoginComponent, HomeComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  dadosRecebidos: UsersBackResponse | null = null
  respostaPost: any = null;
  erroApi: string | null = null;

  constructor(private ApiService: ApiService, private router: Router){}

  ngOnInit(): void {
    console.log('AppComponent inicializado. Pronto para chamadas API.')
  }

  redirectToGetAllUsers(){
    this.router.navigate(["/users"]);
  }

  buscarDadosExemplo(): void{
    console.log('Botão clicado');
    this.limparDados();
    this.ApiService.getData<UsersBackResponse>('/users/teste')
    .subscribe({
      next: (resposta) =>{
        this.dadosRecebidos = resposta;
        console.log('Dados recebidos via GET: ', this.dadosRecebidos)
      },
      error: (erro) => {
        console.log('Erro ao buscar dados (GET): ', erro);
      },
      complete: () => {
        console.log('Requisição completada.');
      }
    });
  }

  

  limparDados(): void{
    this.dadosRecebidos = null;
    this.respostaPost = null;
    this.erroApi = null;
  }


  title = 'goldSellerFront';
}
