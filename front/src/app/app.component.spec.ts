import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { expect } from '@jest/globals';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { SessionService } from './services/session.service';
import { mockRouter, mockSessionService } from 'src/tests/test-utils';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let compiled: HTMLElement;
  let router: Router;
  let sessionService: SessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatToolbarModule],
      declarations: [AppComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SessionService, useValue: mockSessionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService);

    jest.clearAllMocks();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('$isLogged', () => {
    it('should return observable from sessionService', () => {
      const isLoggedObservable = of(true);
      (mockSessionService.$isLogged as jest.Mock).mockReturnValue(
        isLoggedObservable
      );

      const result = component.$isLogged();

      expect(result).toBe(isLoggedObservable);
      expect(mockSessionService.$isLogged).toHaveBeenCalledTimes(1);
    });
  });

  describe('logout', () => {
    it('should call sessionService.logOut', () => {
      component.logout();

      expect(mockSessionService.logOut).toHaveBeenCalledTimes(1);
    });

    it('should navigate to home page', () => {
      component.logout();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
    });
  });

  describe('Template Rendering - Logged', () => {
    beforeEach(() => {
      (mockSessionService.$isLogged as jest.Mock).mockReturnValue(of(true));
      fixture.detectChanges();
    });

    it('should display app title', () => {
      const titleElement = compiled.querySelector('mat-toolbar span');
      expect(titleElement?.textContent).toContain('Yoga app');
    });

    it('should display Sessions link when logged', () => {
      const links = compiled.querySelectorAll('.link');
      const sessionsLink = Array.from(links).find((link) =>
        link.textContent?.includes('Sessions')
      );
      expect(sessionsLink).toBeTruthy();
    });

    it('should display Account link when logged', () => {
      const links = compiled.querySelectorAll('.link');
      const accountLink = Array.from(links).find((link) =>
        link.textContent?.includes('Account')
      );
      expect(accountLink).toBeTruthy();
    });

    it('should display Logout link when logged', () => {
      const links = compiled.querySelectorAll('.link');
      const logoutLink = Array.from(links).find((link) =>
        link.textContent?.includes('Logout')
      );
      expect(logoutLink).toBeTruthy();
    });

    it('should not display Login link when logged', () => {
      const links = compiled.querySelectorAll('.link');
      const loginLink = Array.from(links).find((link) =>
        link.textContent?.includes('Login')
      );
      expect(loginLink).toBeFalsy();
    });

    it('should not display Register link when logged', () => {
      const links = compiled.querySelectorAll('.link');
      const registerLink = Array.from(links).find((link) =>
        link.textContent?.includes('Register')
      );
      expect(registerLink).toBeFalsy();
    });

    it('should call logout when clicking Logout link', () => {
      jest.spyOn(component, 'logout');
      const logoutLink = Array.from(compiled.querySelectorAll('.link')).find(
        (link) => link.textContent?.includes('Logout')
      ) as HTMLElement;

      logoutLink?.click();

      expect(component.logout).toHaveBeenCalledTimes(1);
    });
  });

  describe('Template Rendering - Not Logged', () => {
    beforeEach(() => {
      (mockSessionService.$isLogged as jest.Mock).mockReturnValue(of(false));
      fixture.detectChanges();
    });

    it('should display Login link when not logged', () => {
      const links = compiled.querySelectorAll('.link');
      const loginLink = Array.from(links).find((link) =>
        link.textContent?.includes('Login')
      );
      expect(loginLink).toBeTruthy();
    });

    it('should display Register link when not logged', () => {
      const links = compiled.querySelectorAll('.link');
      const registerLink = Array.from(links).find((link) =>
        link.textContent?.includes('Register')
      );
      expect(registerLink).toBeTruthy();
    });

    it('should not display Sessions link when not logged', () => {
      const links = compiled.querySelectorAll('.link');
      const sessionsLink = Array.from(links).find((link) =>
        link.textContent?.includes('Sessions')
      );
      expect(sessionsLink).toBeFalsy();
    });

    it('should not display Account link when not logged', () => {
      const links = compiled.querySelectorAll('.link');
      const accountLink = Array.from(links).find((link) =>
        link.textContent?.includes('Account')
      );
      expect(accountLink).toBeFalsy();
    });

    it('should not display Logout link when not logged', () => {
      const links = compiled.querySelectorAll('.link');
      const logoutLink = Array.from(links).find((link) =>
        link.textContent?.includes('Logout')
      );
      expect(logoutLink).toBeFalsy();
    });
  });
});
