import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { RegistrationPageComponent } from './registration-page.component';

describe('RegistrationPageComponent', () => {
  let component: RegistrationPageComponent;
  let fixture: ComponentFixture<RegistrationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegistrationPageComponent,
        ReactiveFormsModule,
        HttpClientTestingModule // serve per HttpClient nel component
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('form should be valid when filled correctly', () => {
    component.form.setValue({
      email: 'test@example.com',
      password: 'password123',
      name: 'Mario',
      surname: 'Rossi',
      dob: '1990-01-01',
      gender: 'male',
      phone: '1234567890',
      city: 'Roma'
    });
    expect(component.form.valid).toBeTrue();
  });
});
