import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HitzorduakPage } from './hitzorduak.page';

describe('HitzorduakPage', () => {
  let component: HitzorduakPage;
  let fixture: ComponentFixture<HitzorduakPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HitzorduakPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
