import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhenFormComponent } from './when-form.component';

describe('WhenFormComponent', () => {
  let component: WhenFormComponent;
  let fixture: ComponentFixture<WhenFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhenFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WhenFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
