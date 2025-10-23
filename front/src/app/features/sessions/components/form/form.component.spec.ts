import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import {
  mockSessionService,
  mockSessionApiService,
  mockTeacherService,
  mockActivatedRoute,
  mockRouter,
  mockMatSnackBar,
  mockSession,
  mockTeacher,
} from 'src/tests/test-utils';
import { createComponent } from '@angular/core';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;
  let router: Router;
  let matSnackBar: MatSnackBar;

  beforeEach(async () => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup default mock returns
    mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('1');
    mockTeacherService.all.mockReturnValue(of([mockTeacher]));
    mockSessionApiService.detail.mockReturnValue(of(mockSession));
    mockSessionApiService.create.mockReturnValue(of(mockSession));
    mockSessionApiService.update.mockReturnValue(of(mockSession));

    // Reset router url
    Object.defineProperty(mockRouter, 'url', {
      writable: true,
      value: '/sessions/create',
    });

    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
      declarations: [FormComponent],
    }).compileComponents();

    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);
    router = TestBed.inject(Router);
    matSnackBar = TestBed.inject(MatSnackBar);

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should redirect to sessions if user is not admin', () => {
      mockSessionService.sessionInformation = {
        ...mockSessionService.sessionInformation,
        admin: false,
      };

      component.ngOnInit();

      expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
    });

    it('should fetch all teachers on init', () => {
      expect(component.teachers$).toBeDefined();
    });

    it('should set onUpdate to false for create mode', () => {
      component.ngOnInit();

      expect(component.onUpdate).toBe(false);
    });

    it('should set onUpdate to true for update mode', () => {
      Object.defineProperty(mockRouter, 'url', {
        writable: true,
        value: '/sessions/update/1',
      });

      component.ngOnInit();

      expect(component.onUpdate).toBe(true);
    });

    it('should fetch session details in update mode', () => {
      Object.defineProperty(mockRouter, 'url', {
        writable: true,
        value: '/sessions/update/1',
      });

      component.ngOnInit();

      expect(sessionApiService.detail).toHaveBeenCalledWith('1');
    });

    it('should initialize empty form in create mode', () => {
      component.ngOnInit();

      expect(component.sessionForm?.value).toEqual({
        name: '',
        date: '',
        teacher_id: '',
        description: '',
      });
    });

    it('should initialize form with session data in update mode', () => {
      Object.defineProperty(mockRouter, 'url', {
        writable: true,
        value: '/sessions/update/1',
      });

      component.ngOnInit();

      expect(component.sessionForm?.value.name).toBe(mockSession.name);
      expect(component.sessionForm?.value.teacher_id).toBe(
        mockSession.teacher_id
      );
      expect(component.sessionForm?.value.description).toBe(
        mockSession.description
      );
    });
  });

  describe('Form validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should mark form as invalid when empty', () => {
      expect(component.sessionForm?.valid).toBe(false);
    });

    it('should require name field', () => {
      const nameControl = component.sessionForm?.get('name');
      expect(nameControl?.hasError('required')).toBe(true);
    });

    it('should require date field', () => {
      const dateControl = component.sessionForm?.get('date');
      expect(dateControl?.hasError('required')).toBe(true);
    });

    it('should require teacher_id field', () => {
      const teacherControl = component.sessionForm?.get('teacher_id');
      expect(teacherControl?.hasError('required')).toBe(true);
    });

    it('should require description field', () => {
      const descriptionControl = component.sessionForm?.get('description');
      expect(descriptionControl?.hasError('required')).toBe(true);
    });

    it('should mark form as valid when all fields are filled', () => {
      component.sessionForm?.setValue({
        name: 'Test Session',
        date: '2024-01-15',
        teacher_id: 1,
        description: 'Test description',
      });

      expect(component.sessionForm?.valid).toBe(true);
    });

    it('should validate description max length', () => {
      const descriptionControl = component.sessionForm?.get('description');
      const longDescription = 'a'.repeat(2001);
      descriptionControl?.setValue(longDescription);

      expect(descriptionControl?.hasError('maxlength')).toBe(true);
    });

    it('should accept description with 2000 characters', () => {
      const descriptionControl = component.sessionForm?.get('description');
      const validDescription = 'a'.repeat(2000);
      descriptionControl?.setValue(validDescription);

      expect(descriptionControl?.hasError('maxlength')).toBe(false);
    });
  });

  describe('submit - Create mode', () => {
    const newSession = {
      name: 'New Session',
      date: '2024-01-15',
      teacher_id: 1,
      description: 'New session description',
    };

    beforeEach(() => {
      component.ngOnInit();
      component.sessionForm?.setValue(newSession);
      jest.clearAllMocks();
    });

    it('should call sessionApiService.create with form values', () => {
      component.submit();

      expect(sessionApiService.create).toHaveBeenCalledWith(newSession);
    });

    it('should not call sessionApiService.update in create mode', () => {
      component.submit();

      expect(sessionApiService.update).not.toHaveBeenCalled();
    });

    it('should show success message on create', () => {
      component.submit();

      expect(matSnackBar.open).toHaveBeenCalledWith(
        'Session created !',
        'Close',
        { duration: 3000 }
      );
    });

    it('should navigate to sessions list after create', () => {
      component.submit();

      expect(router.navigate).toHaveBeenCalledWith(['sessions']);
    });
  });

  describe('submit - Update mode', () => {
    const updatedSession = {
      name: 'Updated Session',
      date: '2024-01-20',
      teacher_id: 1,
      description: 'Updated description',
    };

    beforeEach(() => {
      Object.defineProperty(mockRouter, 'url', {
        writable: true,
        value: '/sessions/update/1',
      });
      component.ngOnInit();
      component.sessionForm?.setValue(updatedSession);
      jest.clearAllMocks();
    });

    it('should call sessionApiService.update with id and form values', () => {
      component.submit();

      expect(sessionApiService.update).toHaveBeenCalledWith(
        '1',
        updatedSession
      );
    });

    it('should not call sessionApiService.create in update mode', () => {
      component.submit();

      expect(sessionApiService.create).not.toHaveBeenCalled();
    });

    it('should show success message on update', () => {
      component.submit();

      expect(matSnackBar.open).toHaveBeenCalledWith(
        'Session updated !',
        'Close',
        { duration: 3000 }
      );
    });

    it('should navigate to sessions list after update', () => {
      component.submit();

      expect(router.navigate).toHaveBeenCalledWith(['sessions']);
    });
  });

  describe('Template integration', () => {
    const testSession = {
      name: 'Test Session',
      date: '2024-01-15',
      teacher_id: 1,
      description: 'Test description',
    };

    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should disable submit button when form is invalid', () => {
      const compiled = fixture.nativeElement;
      const submitButton = compiled.querySelector('button[type="submit"]');

      expect(submitButton.disabled).toBe(true);
    });

    it('should enable submit button when form is valid', () => {
      component.sessionForm?.setValue(testSession);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const submitButton = compiled.querySelector('button[type="submit"]');

      expect(submitButton.disabled).toBe(false);
    });

    it('should display "Create session" title in create mode', () => {
      const compiled = fixture.nativeElement;
      const title = compiled.querySelector('h1');

      expect(title?.textContent).toContain('Create session');
    });

    it('should display "Update session" title in update mode', () => {
      Object.defineProperty(mockRouter, 'url', {
        writable: true,
        value: '/sessions/update/1',
      });
      const updateFixture = TestBed.createComponent(FormComponent);
      updateFixture.componentInstance.ngOnInit();
      updateFixture.detectChanges();

      const compiled = updateFixture.nativeElement;
      const title = compiled.querySelector('h1');

      expect(title?.textContent).toContain('Update session');
    });

    it('should call submit method when form is submitted', () => {
      const submitSpy = jest.spyOn(component, 'submit');
      component.sessionForm?.setValue(testSession);
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const form = compiled.querySelector('form');
      form.dispatchEvent(new Event('ngSubmit'));

      expect(submitSpy).toHaveBeenCalled();
    });
  });
});
