import { UserUpdatePayload, UserEditModalComponent } from './../user-edit-modal/user-edit-modal.component';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiService } from '../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserProfile } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';


interface UserUpdate{
  name: string;
  password: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, UserEditModalComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit, OnDestroy{

  displayedUsers: UserProfile[] | null = null;
  isloading: boolean = false;
  erroMessage: string | null = null;
  feedbackMessage: string | null = null;

  emailToSearch: string = '';

  currentUserRole: string | null = null;
  currentUserId: string | null = null;
  isUserCurrentlyAdmin: boolean = false;

  showEditModal: boolean = false;
  userCurrentlyEditing: UserProfile | null = null;

  private authSubscription!: Subscription;


  constructor(private ApiService: ApiService, private authService: AuthService, private router: Router){}
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

      this.loadInitialData();
    })
  }
  
  ngOnDestroy(): void {
    if(this.authSubscription){
      this.authSubscription.unsubscribe();
    }
  }

  loadInitialData() {
    if(!this.authService.isLoggedIn()){
      this.erroMessage = 'Autenticação necessária. Por favor, faça login';
      //this.router.navigate(['/login']);
      console.log('INITIAL DATA IF')
      return;
    }

    if(this.isUserCurrentlyAdmin){
      this.getAllUsers();
    }else if(this.currentUserRole === 'COMMON' && this.currentUserId){
      this.fetchCurrentUserDetails(this.currentUserId);
    }else{
      this.erroMessage = 'Não foi possível determinar o nível de acesso';
      this.displayedUsers = null;
    }
  }
  
  getAllUsers(): void{
    this.isloading = true;
    this.erroMessage = null;
    this.feedbackMessage = 'Carregando usuários';
    this.displayedUsers = null;

    const headers = this.getAuthHeaders();
    if(!headers) return;

    let params;
    if(this.emailToSearch && this.emailToSearch.trim() !== ''){
      params = new HttpParams().set('email', this.emailToSearch.trim());
    }
    
    this.ApiService.getData<UserProfile[]>('/users', params, headers)
    .subscribe({
      next: (response) => {
        this.displayedUsers = response;
        this.feedbackMessage = response.length > 0 ? `Exibindo ${response.length} usuário(s).`: "Nenhum usuário encontrado.";
        this.isloading = false;
        console.log('Dados recebidos: ', this.displayedUsers);
      },
      error: (errr) => this.handleApiError(errr, "Falha ao buscar usuários")       
  });
}

  fetchCurrentUserDetails(userId: string): void{
    this.isloading = true;
    this.erroMessage = null;
    this.feedbackMessage = "Carregando seus dados...";
    this.displayedUsers = null;

    const headers = this.getAuthHeaders();
    if(!headers) return;

    this.ApiService.getData<UserProfile>(`/users/${userId}`, undefined, headers)
    .subscribe({
      next: (response) => {
        this.displayedUsers = response ? [response] : [];
        this.feedbackMessage = response ? "Exibindo seus dados." : "Não foi possível exibir seus dados";
        this.isloading = false;
      },
      error: (err) => this.handleApiError(err, "Falha ao buscar dados")
    });
  }

  initiateUpdate(user: UserProfile): void{
    console.log('Usuário selecionado: ',user);
    this.userCurrentlyEditing = {...user};
    this.showEditModal = true;
  }

  closeUserEditModal(): void{
    this.userCurrentlyEditing = null;
    this.showEditModal = false;
  }

  handleUserUpdate(updatePayload: UserUpdatePayload): void{
    if(!this.userCurrentlyEditing){
      this.erroMessage = "Nenhum usuário selecionado para atualização.";
      this.closeUserEditModal();
      return;
    }

    console.log("Dados recebidos do modal: ",updatePayload);
    this.isloading = true;
    this.erroMessage = null;
    this.feedbackMessage = null;

    const token = this.authService.getToken();
    let headers;
    if(!token){
      this.erroMessage = "Autenticação é necessária. Por favor, faça login";
      this.isloading = false;
      this.closeUserEditModal();
      return;
    }

    headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)

    this.ApiService.updateData<UserUpdatePayload, UserProfile>('/users', this.userCurrentlyEditing.id, updatePayload, headers)
    .subscribe({
      next: (updateUser) =>{
        this.isloading = false;
        this.feedbackMessage = `Usuário "${updateUser.name}" atualizado com sucesso.`
        this.closeUserEditModal();

        this.loadInitialData();
        console.log('Usuário atualizado');
      },
      error: (err) => {
        this.isloading = false;
        const errorDetail = err.error?.mensagem || err.message || 'Erro desconhecido';
        this.erroMessage = `Falha ao atualizar usuário.`
        console.error('Erro ao tentar atualizar usuário: ', errorDetail)
      }
    });
  }

  deleteUser(userToDelete: UserProfile): void{
    if(!confirm(`Tem certeza que deseja deletar o usuário "${userToDelete.name}"?`)){
      return;
    }
    this.isloading = true;
    this.erroMessage = null;

    const headers = this.getAuthHeaders();
    if(!headers) return;

    this.ApiService.deleteData<any>('/users', userToDelete.id, headers)
    .subscribe({
      next:() =>{
        this.feedbackMessage = `Usuário "${userToDelete.name}" deletado.`
        this.isloading = false;
        if(userToDelete.id === this.currentUserId && this.currentUserRole === 'COMMON'){
          this.authService.logout();
        }else{
          this.loadInitialData();
        }
      },
      error: (err) => this.handleApiError(err, `falha ao deletar usuário`)
    });
  }

  
  getAuthHeaders(): HttpHeaders | null {
    const token = this.authService.getToken();
    if(!token){
      this.erroMessage = "Autenticação necessária.";
      this.isloading = false;
      this.router.navigate(['/login'])
      return null;
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  
  handleApiError(err: any, defaultMessage: string): void{
    this.erroMessage = `${defaultMessage}: `+ (err.error?.mensagem || err.message || 'Erro desconhecido');
    if(err.status === 401 || err.status === 403){
      this.authService.logout();
    }
    this.feedbackMessage = null;
    this.isloading = false;
  }

  triggerSearch(): void{
    if(this.isUserCurrentlyAdmin){
      this.getAllUsers();
    }else{
      this.feedbackMessage = "Busca por email não aplicavel para esse perfil."
    }
  }
  
  clearSearchAndShowRelevant(): void {
    this.emailToSearch = '';
    this.loadInitialData();
  }

  

}
