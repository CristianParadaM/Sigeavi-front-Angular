import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodHistoryComponent } from './food-history.component';

describe('FoodHistoryComponent', () => {
  let component: FoodHistoryComponent;
  let fixture: ComponentFixture<FoodHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
