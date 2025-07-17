import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealNewComponent } from './real-new.component';

describe('RealNewComponent', () => {
  let component: RealNewComponent;
  let fixture: ComponentFixture<RealNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RealNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
