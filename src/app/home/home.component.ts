import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  
  constructor(private router: Router, private authService: AuthService){}
  isLoggedIn: boolean = this.authService.isLoggedIn()
  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
      this.router.navigate(['/game'])
    }
  }
  
  homeText: string = 'O Gold Seller foi criado para te ajudar a gerenciar sua venda de gold! Se você ainda não tem uma conta, registre-se'

  registrar(){
    this.router.navigate(['/register'])
  }
 
}
