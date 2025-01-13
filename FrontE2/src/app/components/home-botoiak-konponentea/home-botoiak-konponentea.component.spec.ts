import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeBotoiakKonponenteaComponent } from './home-botoiak-konponentea.component';

describe('HomeBotoiakKonponenteaComponent', () => {
  let component: HomeBotoiakKonponenteaComponent;
  let fixture: ComponentFixture<HomeBotoiakKonponenteaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeBotoiakKonponenteaComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeBotoiakKonponenteaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
