import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostsReportComponent } from './costs-report.component';

describe('CostsReportComponent', () => {
  let component: CostsReportComponent;
  let fixture: ComponentFixture<CostsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostsReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
