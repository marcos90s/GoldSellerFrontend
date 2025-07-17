import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface NewRealTransactionPayload{
  amount: number;
  amountInGold: number;
  charName: string;
  description: string;
}

@Component({
  selector: 'app-real-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './real-new.component.html',
  styleUrl: './real-new.component.scss'
})
export class RealNewComponent implements OnInit{
  amount: number | null = null;
  amountInGold: number | null = null;
  charName: string | null = null;
  description: string | null = null;

  feedbackMessage: string | null = null;

  constructor(){}
  @Output() save = new EventEmitter<NewRealTransactionPayload>();
  @Output() close = new EventEmitter<void>();

  ngOnInit(): void {
    console.log('Modal iniciado!');
  }

  onSave(): void {
    if(!this.amount || !this.amountInGold || !this.charName){
      console.error('Alguns campos são obrigatórios!')
      this.feedbackMessage = 'Existem campos obrigatórios'
      return;
    }

    const newRealTransactionPayload: NewRealTransactionPayload = {
      amount: this.amount,
      amountInGold: this.amountInGold,
      charName: this.charName,
      description: this.description ?? ''
    }

    this.save.emit(newRealTransactionPayload)
  }

  closeModal(){
    this.close.emit();
  }
}
