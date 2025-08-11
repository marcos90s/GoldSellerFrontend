import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { AuthService, UserProfile } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy{
  
  isLoggedIn$!: Observable<boolean>;
  currentUser$!: Observable<UserProfile | null>;
  currentUserProfile: UserProfile | null = null;
  erroMessage: string = '';
 
  private authSubscription!: Subscription;
  
  constructor(private authService: AuthService, private apiService: ApiService, private router: Router){}

  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser$;
    this.getCurrentUserInfo();
    console.log('total gold',this.currentUserProfile)
    this.isLoggedIn$ = this.currentUser$.pipe(
      map(user => !!user)
    )
  }
  ngOnDestroy(): void {
    if (this.authSubscription) { 
       this.authSubscription.unsubscribe();
     }
  }

  logout(): void{
    console.log('HeaderComponent: Chamando authService.logout()');
    this.authService.logout();
  }

  getCurrentUserInfo(): UserProfile | void{
    const headers = this.authService.getAuthHeaders();
    if(!headers) return;
    
    this.apiService.getData<UserProfile>(`/users/${this.authService.getCurrentUserId()}`, undefined, headers)
    .subscribe({
      next: (response) => {
        console.log('response',response)
        this.currentUserProfile = response;
      },
      error:(err) => this.erroMessage = 'Algo deu errado'
    });
    
  }

  

}
