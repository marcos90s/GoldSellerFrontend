import { GameNewComponent, NewGameTransactionPayload } from '../game-new/game-new.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

interface GameTransactionInfo{
  id: string;
  userId: string;
  amount: number;
  quantity: number;
  itemName: string;
  type: string;
  localDateTime: Date;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FormsModule, GameNewComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit{
  displayedGameTransactions: GameTransactionInfo[] | null = null;
  isLoading: boolean = false;
  erroMessage: string | null = null
  openAddTransaction: boolean = false;
  loadingRegister: boolean = false
  registerMessage: string | null = null

  currentUserRole: string | null = null;
  currentUserId: string | null = null;
  isUserCurrentlyAdmin: boolean = false;

  isLoggedIn: boolean = false;


  private authSubscription!: Subscription;

  constructor(private apiService: ApiService, private authService: AuthService, private router: Router){}

  ngOnInit(): void{
    this.authSubscription = this.authService.currentUser$.subscribe(user =>{
      if(user){
        this.currentUserId = user.id;
        this.currentUserRole = user.role;
        this.isUserCurrentlyAdmin = this.authService.isAdmin();
      }else{
        this.currentUserId = null;
        this.currentUserRole = null;
        this.isUserCurrentlyAdmin = false;
      }
    })
    this.isLoggedIn = this.authService.isLoggedIn();
    if(!this.isLoggedIn){
      console.log('LoggedIN: ', this.isLoggedIn)
      setTimeout(() =>{
        this.router.navigate(['/home'])
      }, 1000)
    }
    this.getGameTransactByUserId();
  }

  postGameTransaction(newGameTransaction: NewGameTransactionPayload): void {
    console.log('Iniciando registro');
    this.loadingRegister = true;
    const token = this.authService.getToken();
    let headers;
    if(!token){
      this.erroMessage = 'Autenticação necessária';
      this.loadingRegister = false;
      return
    }

    if(!newGameTransaction.amount || !newGameTransaction.itemName || !newGameTransaction.quantity || !newGameTransaction.type ){
      this.erroMessage = 'Você deve preencher todas as informações';
      console.log(this.erroMessage);
      this.loadingRegister = false;
      return
    }

    headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    newGameTransaction.userId = this.currentUserId;

    this.apiService.postData<NewGameTransactionPayload, GameTransactionInfo>('/game', newGameTransaction, {headers})
    .subscribe({
      next: (response) => {
        this.loadingRegister = false;
        this.registerMessage = 'Transação registrada';
        console.log('Registro bem sucedido! Resposta: ',response)
        setTimeout(() =>{
          this.closeGameAddModal()
        }, 1000)
      },
      error:(erro) =>{
        this.loadingRegister = false;
        this.erroMessage = erro.message;
        console.log('Mensagem de erro', this.erroMessage)
      },
      complete: ()=>{
        this.loadingRegister = false;
        console.log('Requisição de registro completa.')
        this.getGameTransactByUserId()
      }
    })

  }

  getGameTransactByUserId(): void{
    this.displayedGameTransactions = null;
    this.isLoading = true;

    const headers = this.authService.getAuthHeaders();
    if(!headers){
      this.erroMessage = 'Autenticação é necessária!'
      this.isLoading = false;
      this.router.navigate(['/login'])
      return
    }

    this.apiService.getData<GameTransactionInfo[]>(`/game/user/${this.currentUserId}`, undefined, headers)
    .subscribe({
      next: (response) => {
        this.displayedGameTransactions = response;
        this.isLoading = false;
        console.log('Dados recebidos: ', this.displayedGameTransactions);
      },
      error: (err) => this.erroMessage = 'Algo deu errado ;('
    });
  }

  showAddTransaction(){
      this.openAddTransaction = true
  }
  
  closeGameAddModal(): void {
    this.openAddTransaction = false
  }

}
