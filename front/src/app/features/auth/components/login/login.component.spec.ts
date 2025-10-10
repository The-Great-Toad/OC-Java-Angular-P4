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
import { SessionService } from 'src/app/services/session.service';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import {
  mockSessionService,
  mockAuthService,
  mockRouter,
  mockSessionInformation,
} from 'src/tests/test-utils';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let sessionService: SessionService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: SessionService, useValue: mockSessionService },
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);

    // Reset mocks
    jest.clearAllMocks();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should initialize with hide set to true', () => {
      expect(component.hide).toBe(true);
    });

    it('should initialize with onError set to false', () => {
      expect(component.onError).toBe(false);
    });

    it('should initialize form with empty email and password', () => {
      expect(component.form.value).toEqual({
        email: '',
        password: '',
      });
    });

    it('should create form with email and password controls', () => {
      expect(component.form.contains('email')).toBe(true);
      expect(component.form.contains('password')).toBe(true);
    });
  });

  describe('Form validation', () => {
    it('should mark form as invalid when empty', () => {
      expect(component.form.valid).toBe(false);
    });

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

    it('should mark password as invalid when empty', () => {
      const passwordControl = component.form.controls['password'];
      expect(passwordControl.valid).toBe(false);
      expect(passwordControl.hasError('required')).toBe(true);
    });

    it('should mark password as invalid when less than 3 characters', () => {
      const passwordControl = component.form.controls['password'];
      passwordControl.setValue('12');
      expect(passwordControl.valid).toBe(false);
      expect(passwordControl.hasError('minlength')).toBe(true);
    });

    it('should mark password as valid when provided', () => {
      const passwordControl = component.form.controls['password'];
      passwordControl.setValue('123');
      expect(passwordControl.valid).toBe(true);
    });

    it('should mark form as valid when all fields are correctly filled', () => {
      component.form.setValue({
        email: 'test@test.com',
        password: '123',
      });
      expect(component.form.valid).toBe(true);
    });
  });

  describe('submit', () => {
    const loginCredentials = {
      email: 'test@test.com',
      password: 'password123',
    };

    beforeEach(() => {
      component.form.setValue(loginCredentials);
    });

    it('should call authService.login with form values', () => {
      mockAuthService.login.mockReturnValue(of(mockSessionInformation));

      component.submit();

      expect(authService.login).toHaveBeenCalledWith(loginCredentials);
    });

    it('should call sessionService.logIn on successful login', () => {
      mockAuthService.login.mockReturnValue(of(mockSessionInformation));

      component.submit();

      expect(sessionService.logIn).toHaveBeenCalledWith(mockSessionInformation);
    });

    it('should navigate to /sessions on successful login', () => {
      mockAuthService.login.mockReturnValue(of(mockSessionInformation));

      component.submit();

      expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
    });

    it('should set onError to true when login fails', () => {
      mockAuthService.login.mockReturnValue(
        throwError(() => new Error('Login failed'))
      );

      component.submit();

      expect(component.onError).toBe(true);
    });
  });

  describe('Template integration', () => {
    const validLoginForm = {
      email: 'test@test.com',
      password: 'password123',
    };

    it('should disable submit button when form is invalid', () => {
      const compiled = fixture.nativeElement;
      const submitButton = compiled.querySelector('button[type="submit"]');

      expect(submitButton.disabled).toBe(true);
    });

    it('should enable submit button when form is valid', () => {
      component.form.setValue(validLoginForm);
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
      mockAuthService.login.mockReturnValue(of(mockSessionInformation));

      component.form.setValue(validLoginForm);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const form = compiled.querySelector('form');
      form.dispatchEvent(new Event('ngSubmit'));

      expect(submitSpy).toHaveBeenCalled();
    });

    it('should toggle password visibility when icon button is clicked', () => {
      const compiled = fixture.nativeElement;
      const toggleButton = compiled.querySelector('button[mat-icon-button]');

      expect(component.hide).toBe(true);

      toggleButton.click();
      fixture.detectChanges();

      expect(component.hide).toBe(false);
    });

    it('should display visibility icon when password is hidden', () => {
      component.hide = true;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const icon = compiled.querySelector('mat-icon');

      expect(icon.textContent).toContain('visibility_off');
    });

    it('should display visibility_off icon when password is visible', () => {
      component.hide = false;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const icon = compiled.querySelector('mat-icon');

      expect(icon.textContent).toContain('visibility');
    });
  });
});
