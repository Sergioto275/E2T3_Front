import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GrafikoakPage } from './grafikoak.page';

describe('GrafikoakPage', () => {
  let component: GrafikoakPage;
  let fixture: ComponentFixture<GrafikoakPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GrafikoakPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
