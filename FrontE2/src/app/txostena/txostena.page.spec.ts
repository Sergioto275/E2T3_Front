import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TxostenaPage } from './txostena.page';

describe('TxostenaPage', () => {
  let component: TxostenaPage;
  let fixture: ComponentFixture<TxostenaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TxostenaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
