import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { mockAuthService, mockRouter } from 'src/tests/test-utils';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    // Reset mocks
    jest.clearAllMocks();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should initialize with onError set to false', () => {
      expect(component.onError).toBe(false);
    });

    it('should initialize form with empty fields', () => {
      expect(component.form.value).toEqual({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
      });
    });

    it('should create form with all required controls', () => {
      expect(component.form.contains('email')).toBe(true);
      expect(component.form.contains('firstName')).toBe(true);
      expect(component.form.contains('lastName')).toBe(true);
      expect(component.form.contains('password')).toBe(true);
    });
  });

  describe('Form validation', () => {
    it('should mark form as invalid when empty', () => {
      expect(component.form.valid).toBe(false);
    });

    describe('Email validation', () => {
      it('should mark email as invalid when empty', () => {
        const emailControl = component.form.controls['email'];
        expect(emailControl.valid).toBe(false);
        expect(emailControl.hasError('required')).toBe(true);
      });

      it('should mark email as invalid when format is incorrect', () => {
        const emailControl = component.form.controls['email'];
        emailControl.setValue('invalid-email');
        expect(emailControl.valid).toBe(false);
        expect(emailControl.hasError('email')).toBe(true);
      });

      it('should mark email as valid when format is correct', () => {
        const emailControl = component.form.controls['email'];
        emailControl.setValue('test@test.com');
        expect(emailControl.valid).toBe(true);
      });
    });

    describe('FirstName validation', () => {
      it('should mark firstName as invalid when empty', () => {
        const firstNameControl = component.form.controls['firstName'];
        expect(firstNameControl.valid).toBe(false);
        expect(firstNameControl.hasError('required')).toBe(true);
      });

      it('should mark firstName as invalid when less than 3 characters', () => {
        const firstNameControl = component.form.controls['firstName'];
        firstNameControl.setValue('12');
        expect(firstNameControl.valid).toBe(false);
        expect(firstNameControl.hasError('minlength')).toBe(true);
      });

      it('should mark firstName as invalid when more than 20 characters', () => {
        const firstNameControl = component.form.controls['firstName'];
        firstNameControl.setValue('123456789012345678901');
        expect(firstNameControl.valid).toBe(false);
        expect(firstNameControl.hasError('maxlength')).toBe(true);
      });

      it('should mark firstName as valid when provided', () => {
        const firstNameControl = component.form.controls['firstName'];
        firstNameControl.setValue('John');
        expect(firstNameControl.valid).toBe(true);
      });
    });

    describe('LastName validation', () => {
      it('should mark lastName as invalid when empty', () => {
        const lastNameControl = component.form.controls['lastName'];
        expect(lastNameControl.valid).toBe(false);
        expect(lastNameControl.hasError('required')).toBe(true);
      });

      it('should mark lastName as invalid when less than 3 characters', () => {
        const lastNameControl = component.form.controls['lastName'];
        lastNameControl.setValue('Jo');
        expect(lastNameControl.valid).toBe(false);
        expect(lastNameControl.hasError('minlength')).toBe(true);
      });

      it('should mark lastName as invalid when more than 20 characters', () => {
        const lastNameControl = component.form.controls['lastName'];
        lastNameControl.setValue('123456789012345678901');
        expect(lastNameControl.valid).toBe(false);
        expect(lastNameControl.hasError('maxlength')).toBe(true);
      });

      it('should mark lastName as valid when provided', () => {
        const lastNameControl = component.form.controls['lastName'];
        lastNameControl.setValue('Doe');
        expect(lastNameControl.valid).toBe(true);
      });
    });

    describe('Password validation', () => {
      it('should mark password as invalid when empty', () => {
        const passwordControl = component.form.controls['password'];
        expect(passwordControl.valid).toBe(false);
        expect(passwordControl.hasError('required')).toBe(true);
      });

      it('should mark password as invalid when less than 3 characters', () => {
        const passwordControl = component.form.controls['password'];
        passwordControl.setValue('Jo');
        expect(passwordControl.valid).toBe(false);
        expect(passwordControl.hasError('minlength')).toBe(true);
      });

      it('should mark password as invalid when more than 40 characters', () => {
        const passwordControl = component.form.controls['password'];
        passwordControl.setValue(
          '123456789012345678901234567890123456789012345678901'
        );
        expect(passwordControl.valid).toBe(false);
        expect(passwordControl.hasError('maxlength')).toBe(true);
      });

      it('should mark password as valid when provided', () => {
        const passwordControl = component.form.controls['password'];
        passwordControl.setValue('password123');
        expect(passwordControl.valid).toBe(true);
      });
    });

    it('should mark form as valid when all fields are correctly filled', () => {
      component.form.setValue({
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      });
      expect(component.form.valid).toBe(true);
    });

    it('should mark form as invalid when at least one field is invalid', () => {
      component.form.setValue({
        email: 'invalid-email',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
      });
      expect(component.form.valid).toBe(false);
    });
  });

  describe('submit', () => {
    const validRegisterForm = {
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
    };

    beforeEach(() => {
      component.form.setValue(validRegisterForm);
    });

    it('should call authService.register with form values', () => {
      mockAuthService.register.mockReturnValue(of(void 0));

      component.submit();

      expect(authService.register).toHaveBeenCalledWith(validRegisterForm);
    });

    it('should navigate to /login on successful registration', () => {
      mockAuthService.register.mockReturnValue(of(void 0));

      component.submit();

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should set onError to true when registration fails', () => {
      mockAuthService.register.mockReturnValue(
        throwError(() => new Error('Registration failed'))
      );

      component.submit();

      expect(component.onError).toBe(true);
    });
  });

  describe('Template integration', () => {
    const validRegisterForm = {
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
    };

    it('should disable submit button when form is invalid', () => {
      const compiled = fixture.nativeElement;
      const submitButton = compiled.querySelector('button[type="submit"]');

      expect(submitButton.disabled).toBe(true);
    });

    it('should enable submit button when form is valid', () => {
      component.form.setValue(validRegisterForm);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const submitButton = compiled.querySelector('button[type="submit"]');

      expect(submitButton.disabled).toBe(false);
    });

    it('should not display error message initially', () => {
      const compiled = fixture.nativeElement;
      const errorMessage = compiled.querySelector('.error');

      expect(errorMessage).toBeNull();
    });

    it('should display error message when onError is true', () => {
      component.onError = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const errorMessage = compiled.querySelector('.error');

      expect(errorMessage).toBeTruthy();
      expect(errorMessage.textContent).toContain('An error occurred');
    });

    it('should call submit method when form is submitted', () => {
      const submitSpy = jest.spyOn(component, 'submit');
      mockAuthService.register.mockReturnValue(of(void 0));

      component.form.setValue(validRegisterForm);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const form = compiled.querySelector('form');
      form.dispatchEvent(new Event('ngSubmit'));

      expect(submitSpy).toHaveBeenCalled();
    });

    it('should update form control when user types in firstName input', () => {
      const compiled = fixture.nativeElement;
      const firstNameInput = compiled.querySelector(
        'input[formControlName="firstName"]'
      );

      firstNameInput.value = 'Jane';
      firstNameInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.form.controls['firstName'].value).toBe('Jane');
    });

    it('should update form control when user types in email input', () => {
      const compiled = fixture.nativeElement;
      const emailInput = compiled.querySelector(
        'input[formControlName="email"]'
      );

      emailInput.value = 'jane@test.com';
      emailInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.form.controls['email'].value).toBe('jane@test.com');
    });
  });
});
