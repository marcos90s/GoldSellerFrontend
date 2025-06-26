import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserProfile{
  id: string;
  name: string;
  email: string;
  role: string;
  totalGold?: number | null;
  totalMoney?: number | null;
}

export interface LoginResponse{
  token: string;
  user: UserProfile;
}

const TOKEN_KEY = 'MeuAppToken';
const USER_DATA_KEY = 'userData';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<UserProfile | null> ;
  public currentUser$: Observable<UserProfile | null>; 

  constructor(private router: Router) { 
    const storedUser = localStorage.getItem(USER_DATA_KEY);
    const initialUser = storedUser? JSON.parse(storedUser) as UserProfile : null;
    this.currentUserSubject = new BehaviorSubject<UserProfile | null>(initialUser)
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserProfile | null{
    return this.currentUserSubject.value;
  }

  public login(loginData: LoginResponse): void{
    localStorage.setItem(TOKEN_KEY, loginData.token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(loginData.user));
    this.currentUserSubject.next(loginData.user);
    this.router.navigate(['/home']);
  }

  public logout(): void{
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  public getToken(): string | null{
    return localStorage.getItem(TOKEN_KEY);
  }

  public isLoggedIn(): boolean{
    return !!this.getToken() && !!this.currentUserValue 
  }

  public getCurrentUserId(): string | null{
    return this.currentUserValue ? this.currentUserValue.id : null;
  }

  public getUserRole(): string | null{
    return this.currentUserValue ? this.currentUserValue.role : null;
  }

  public isAdmin(): boolean{
    return this.getUserRole() === 'ADMIN';
  }
}
