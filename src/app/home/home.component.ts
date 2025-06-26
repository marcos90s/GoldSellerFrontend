import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private router: Router){}
  
  homeText: string = 'O Gold Seller foi criado para te ajudar a gerenciar sua venda de gold! Se você ainda não tem uma conta, registre-se'

  registrar(){
    this.router.navigate(['/register'])
  }
}
