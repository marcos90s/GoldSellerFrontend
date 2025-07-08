import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface NewGameTransactionPayload{
  type: string;
  amount: number;
  quantity: number;
  itemName: string;
  userId: string | null;
}

@Component({
  selector: 'app-game-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game-new.component.html',
  styleUrl: './game-new.component.scss'
})
export class GameNewComponent implements OnInit, OnChanges{
  type: string = '';
  amount: number | null = null;
  quantity: number | null = null;
  itemName: string = '';
  userId: string | null = null;

  feedbackMessage: string | null = null;

  constructor(){}
  //armazenar os dados da nova transação
  @Output() save = new EventEmitter<NewGameTransactionPayload>();
  @Output() close = new EventEmitter<void>();


  ngOnInit(): void {
    console.log('Modal Inicializado');
  }
    
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  onSave(): void {
    if(!this.type || !this.amount || !this.quantity|| !this.itemName){
      console.error('Todos os campos são obrigatórios!');
      return
    }

      const newGameTransactionPaylod: NewGameTransactionPayload = {
      type: this.type,
      amount: this.amount ?? 0,
      quantity: this.quantity ?? 0,
      itemName: this.itemName,
      userId: this.userId ?? null
      }
      
      console.log('salvando alterações: ', newGameTransactionPaylod)
      this.save.emit(newGameTransactionPaylod);
    
  }

  closeModal(){
    this.close.emit()
  }


}
