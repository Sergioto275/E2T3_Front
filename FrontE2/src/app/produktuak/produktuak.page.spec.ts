import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProduktuakPage } from './produktuak.page';

describe('ProduktuakPage', () => {
  let component: ProduktuakPage;
  let fixture: ComponentFixture<ProduktuakPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduktuakPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
