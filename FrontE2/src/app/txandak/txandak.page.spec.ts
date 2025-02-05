import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TxandakPage } from './txandak.page';

describe('TxandakPage', () => {
  let component: TxandakPage;
  let fixture: ComponentFixture<TxandakPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TxandakPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
