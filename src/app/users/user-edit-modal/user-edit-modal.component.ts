import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserProfile } from '../../core/auth.service';

export interface UserUpdatePayload{
  name?: string;
  password?: string;
}

@Component({
  selector: 'app-user-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-edit-modal.component.html',
  styleUrl: './user-edit-modal.component.scss'
})
export class UserEditModalComponent implements OnInit, OnChanges{

  @Input() user: UserProfile | null = null;
  @Output() save = new EventEmitter<UserUpdatePayload>();
  @Output() close = new EventEmitter<void>();

  editName: string = '';
  newPassword?: string = '';

  originalName: string = '';

  constructor(){}
  
  ngOnInit(): void {
    this.initializeForm();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['user'] && this.user){
      this.initializeForm();
    }
  }

  initializeForm() {
    if(this.user){
      this.editName = this.user.name;
      this.originalName = this.user.name;
      this.newPassword = '';
      console.log('Modal inicializado: ', this.user);
    }
  }

  onSave(): void{
    if(!this.user)return;

    const payload: UserUpdatePayload = {};
    let hasChanges = false;

    if(this.editName.trim() !== '' && this.editName.trim() !== this.originalName){
      payload.name = this.editName.trim();
      hasChanges = true;
    }

    if(this.newPassword && this.newPassword.trim() !== ''){
      payload.password = this.newPassword.trim();
      hasChanges = true;
    }

    if(hasChanges){
      console.log('Salvando alterações: ', payload);
      this.save.emit(payload);
    }else{
      console.log('Nenhuma alteração detectada.')
      this.closeModal();
    }

  }
  closeModal() {
    this.close.emit();
  }
  
}
