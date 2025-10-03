import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

import { MeComponent } from './me.component';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let mockUserService: any;
  let mockRouter: any;
  let mockMatSnackBar: any;
  let mockSessionService: any;

  const mockUser: User = {
    id: 1,
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    admin: false,
    password: 'password',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02'),
  };

  const mockAdminUser: User = {
    ...mockUser,
    admin: true,
  };

  const mockSessionInformation: SessionInformation = {
    token: 'mock-token',
    type: 'Bearer',
    id: 1,
    username: 'testuser',
    firstName: 'John',
    lastName: 'Doe',
    admin: false,
  };

  beforeEach(async () => {
    // Mock des services
    mockUserService = {
      getById: jest.fn(),
      delete: jest.fn(),
    };

    mockRouter = {
      navigate: jest.fn(),
    };

    mockMatSnackBar = {
      open: jest.fn(),
    };

    mockSessionService = {
      sessionInformation: mockSessionInformation,
      logOut: jest.fn(),
    };

    // Mock de window.history.back
    Object.defineProperty(window, 'history', {
      value: { back: jest.fn() },
      writable: true,
    });

    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should fetch user information on init', () => {
      // Arrange
      mockUserService.getById.mockReturnValue(of(mockUser));

      // Act
      component.ngOnInit();

      // Assert
      expect(mockUserService.getById).toHaveBeenCalledWith('1');
      expect(component.user).toEqual(mockUser);
    });

    it('should call userService.getById with correct user id', () => {
      // Arrange
      mockUserService.getById.mockReturnValue(of(mockUser));

      // Act
      component.ngOnInit();

      // Assert
      expect(mockUserService.getById).toHaveBeenCalledTimes(1);
      expect(mockUserService.getById).toHaveBeenCalledWith('1');
    });
  });

  describe('back', () => {
    it('should call window.history.back', () => {
      // Arrange
      const historyBackSpy = jest.spyOn(window.history, 'back');

      // Act
      component.back();

      // Assert
      expect(historyBackSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      mockUserService.delete.mockReturnValue(of({}));
    });

    it('should delete user account', () => {
      // Act
      component.delete();

      // Assert
      expect(mockUserService.delete).toHaveBeenCalledWith('1');
    });

    it('should show success message after deletion', () => {
      // Act
      component.delete();

      // Assert
      expect(mockMatSnackBar.open).toHaveBeenCalledWith(
        'Your account has been deleted !',
        'Close',
        { duration: 3000 }
      );
    });

    it('should log out user and navigate to home page after deletion', () => {
      // Act
      component.delete();

      // Assert
      expect(mockUserService.delete).toHaveBeenCalledWith('1');
      expect(mockMatSnackBar.open).toHaveBeenCalled();
      expect(mockSessionService.logOut).toHaveBeenCalledTimes(1);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
