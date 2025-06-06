import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { AuthService, UserProfile } from '../../core/auth.service';

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

  private authSubscription!: Subscription;
  
  constructor(private authService: AuthService, private router: Router){}
  
  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser$;
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

}
