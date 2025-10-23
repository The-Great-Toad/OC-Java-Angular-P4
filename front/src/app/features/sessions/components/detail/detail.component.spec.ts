import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';
import { SessionApiService } from '../../services/session-api.service';

import { DetailComponent } from './detail.component';
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

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;
  let router: Router;
  let matSnackBar: MatSnackBar;

  beforeEach(async () => {
    // Setup mock activated route
    mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('1');

    await TestBed.configureTestingModule({
      imports: [HttpClientModule, MatSnackBarModule, ReactiveFormsModule],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
    }).compileComponents();

    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);
    router = TestBed.inject(Router);
    matSnackBar = TestBed.inject(MatSnackBar);

    // Reset mocks
    jest.clearAllMocks();

    // Setup default mock returns
    mockSessionApiService.detail.mockReturnValue(of(mockSession));
    mockTeacherService.detail.mockReturnValue(of(mockTeacher));

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should get session id from route params', () => {
      expect(component.sessionId).toBe('1');
      expect(mockActivatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith(
        'id'
      );
    });

    it('should set isAdmin from sessionService', () => {
      expect(component.isAdmin).toBe(sessionService.sessionInformation!.admin);
    });

    it('should set userId from sessionService', () => {
      expect(component.userId).toBe(
        sessionService.sessionInformation!.id.toString()
      );
    });

    it('should fetch session on init', () => {
      expect(sessionApiService.detail).toHaveBeenCalledWith('1');
    });

    it('should set session data', () => {
      expect(component.session).toEqual(mockSession);
    });

    it('should fetch teacher data on init', () => {
      expect(teacherService.detail).toHaveBeenCalledWith(
        mockSession.teacher_id.toString()
      );
    });

    it('should set teacher data', () => {
      expect(component.teacher).toEqual(mockTeacher);
    });

    it('should set isParticipate to true when user is in session', () => {
      const sessionWithUser = { ...mockSession, users: [1, 2] };
      mockSessionApiService.detail.mockReturnValue(of(sessionWithUser));

      component.ngOnInit();

      expect(component.isParticipate).toBe(true);
    });

    it('should set isParticipate to false when user is not in session', () => {
      const sessionWithoutUser = { ...mockSession, users: [2, 3] };
      mockSessionApiService.detail.mockReturnValue(of(sessionWithoutUser));

      component.ngOnInit();

      expect(component.isParticipate).toBe(false);
    });
  });

  describe('back', () => {
    it('should call window.history.back', () => {
      const backSpy = jest.spyOn(window.history, 'back');

      component.back();

      expect(backSpy).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      mockSessionApiService.delete.mockReturnValue(of({}));
    });

    it('should call sessionApiService.delete with sessionId', () => {
      component.delete();

      expect(sessionApiService.delete).toHaveBeenCalledWith('1');
    });

    it('should show snackbar message on successful delete', () => {
      component.delete();

      expect(matSnackBar.open).toHaveBeenCalledWith(
        'Session deleted !',
        'Close',
        { duration: 3000 }
      );
    });

    it('should navigate to sessions list on successful delete', () => {
      component.delete();

      expect(router.navigate).toHaveBeenCalledWith(['sessions']);
    });
  });

  describe('participate', () => {
    beforeEach(() => {
      mockSessionApiService.participate.mockReturnValue(of(undefined));
      mockSessionApiService.detail.mockReturnValue(of(mockSession));
      mockTeacherService.detail.mockReturnValue(of(mockTeacher));
    });

    it('should call sessionApiService.participate with sessionId and userId', () => {
      component.participate();

      expect(sessionApiService.participate).toHaveBeenCalledWith('1', '1');
    });

    it('should fetch session after participation', () => {
      component.participate();

      expect(sessionApiService.detail).toHaveBeenCalledWith('1');
    });

    it('should update isParticipate to true after participation', () => {
      const updatedSession = { ...mockSession, users: [1, 2, 3] };
      mockSessionApiService.detail.mockReturnValue(of(updatedSession));

      component.participate();

      expect(component.isParticipate).toBe(true);
    });
  });

  describe('unParticipate', () => {
    beforeEach(() => {
      mockSessionApiService.unParticipate.mockReturnValue(of(undefined));
      mockSessionApiService.detail.mockReturnValue(
        of({ ...mockSession, users: [] })
      );
      mockTeacherService.detail.mockReturnValue(of(mockTeacher));
    });

    it('should call sessionApiService.unParticipate with sessionId and userId', () => {
      component.unParticipate();

      expect(sessionApiService.unParticipate).toHaveBeenCalledWith('1', '1');
    });

    it('should fetch session after unparticipation', () => {
      component.unParticipate();

      expect(sessionApiService.detail).toHaveBeenCalledWith('1');
    });

    it('should update isParticipate to false after unparticipation', () => {
      const updatedSession = { ...mockSession, users: [] };
      mockSessionApiService.detail.mockReturnValue(of(updatedSession));

      component.unParticipate();

      expect(component.isParticipate).toBe(false);
    });
  });

  describe('Admin vs User behavior', () => {
    it('should show delete button for admin users', () => {
      mockSessionService.sessionInformation = {
        ...mockSessionService.sessionInformation,
        admin: true,
      };

      const adminFixture = TestBed.createComponent(DetailComponent);
      const adminComponent = adminFixture.componentInstance;
      adminComponent.session = mockSession;
      adminFixture.detectChanges();

      expect(adminComponent.isAdmin).toBe(true);
    });

    it('should show participate buttons for non-admin users', () => {
      mockSessionService.sessionInformation = {
        ...mockSessionService.sessionInformation,
        admin: false,
      };

      const userFixture = TestBed.createComponent(DetailComponent);
      const userComponent = userFixture.componentInstance;
      userComponent.session = mockSession;
      userFixture.detectChanges();

      expect(userComponent.isAdmin).toBe(false);
    });
  });
});
