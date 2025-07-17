import { NewRealTransactionPayload, RealNewComponent } from './../real-new/real-new.component';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

export interface RealTransactionInfo{
  id: string;
  userId: string;
  amount: number;
  amountInGold: number;
  charName: string;
  description: string;
  date: Date;
}

@Component({
  selector: 'app-real-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule, RealNewComponent],
  templateUrl: './real-transaction.component.html',
  styleUrl: './real-transaction.component.scss'
})
export class RealTransactionComponent implements OnInit{
displayedRelTransaction: RealTransactionInfo[] | null = null
isLoading: boolean = false;
erroMessage: string | null = null;
currentUserId: string | null = null;
isLoggedIn: boolean = false;
currentUserRole: string | null = null;
isUserCurrentlyAdmin: boolean = false;
feedbackMessage: string | null = null;
loadingRegister: boolean = false;
openAddTransactionModal: boolean = false;

private authSubscription!: Subscription;

constructor(private apiService: ApiService, private authService: AuthService, private router: Router){}

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
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
      setTimeout(()=>{
        this.router.navigate(['/home'])
      }, 1000)
    }
    this.getRealTransactionByUserId();
  }

  postRealTransaction(newRealTransactionPayload: NewRealTransactionPayload): void{
    this.loadingRegister = true;
    const token = this.authService.getToken();
    if(!token){
      this.erroMessage = 'Autenticação é necessária.'
      this.loadingRegister = false;
      return
    }
    if(!newRealTransactionPayload.amount || !newRealTransactionPayload.amountInGold || !newRealTransactionPayload.charName){
      this.erroMessage = 'Alguns campos são obrigatórios.'
      this.loadingRegister = false;
      return
    }

    let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.apiService.postData<NewRealTransactionPayload, RealTransactionInfo>('/real', newRealTransactionPayload, {headers})
    .subscribe({
      next: (response) =>{
        this.loadingRegister = false;
        this.feedbackMessage = 'Inserido com sucesso';
        this.closeAddModal();
        console.log('Registro bem sucedido! Resposta: ',response)
      },
      error: (erro) =>{
        this.loadingRegister = false;
        this.erroMessage = erro.message;

      },
      complete: ()=>{
        this.getRealTransactionByUserId();
      }
    })
  }

  getRealTransactionByUserId(): void{
    this.displayedRelTransaction = null;
    this.isLoading = true;

    const headers = this.authService.getAuthHeaders();
    if(!headers){
      this.erroMessage = 'Autenticação é necessária!';
      this.isLoading = false;
      this.router.navigate(['/login'])
      return
    }

    this.apiService.getData<RealTransactionInfo[]>(`/real/user/${this.currentUserId}`, undefined, headers)
    .subscribe({
      next: (response) => {
        if(response.length === 0){
          console.log('Ta vazio')
          this.feedbackMessage = 'Não contém dados.'
          return
        }
        this.displayedRelTransaction = response;
        this.isLoading = false;
        console.log('Dados recebidos: ', this.displayedRelTransaction);
      },
      error: (err)=> this.erroMessage = 'Algo deu errado.'
    })
  }

  showAddTransaction(){
    this.openAddTransactionModal = true;
  }

  closeAddModal(){
    this.openAddTransactionModal = false;
  }

}
