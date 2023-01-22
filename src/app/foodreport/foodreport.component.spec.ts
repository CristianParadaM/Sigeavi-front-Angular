import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodreportComponent } from './foodreport.component';

describe('FoodreportComponent', () => {
  let component: FoodreportComponent;
  let fixture: ComponentFixture<FoodreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodreportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
