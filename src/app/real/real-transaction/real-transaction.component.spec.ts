import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTransactionComponent } from './real-transaction.component';

describe('RealTransactionComponent', () => {
  let component: RealTransactionComponent;
  let fixture: ComponentFixture<RealTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealTransactionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RealTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
