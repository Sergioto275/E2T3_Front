import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InbentarioaPage } from './inbentarioa.page';

describe('InbentarioaPage', () => {
  let component: InbentarioaPage;
  let fixture: ComponentFixture<InbentarioaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InbentarioaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
