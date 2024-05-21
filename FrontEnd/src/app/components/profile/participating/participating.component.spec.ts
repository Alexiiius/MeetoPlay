import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipatingComponent } from './participating.component';

describe('ParticipatingComponent', () => {
  let component: ParticipatingComponent;
  let fixture: ComponentFixture<ParticipatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipatingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticipatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
