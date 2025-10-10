import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { ListComponent } from './list.component';
import {
  mockSessionService,
  mockSessionApiService,
  mockSession,
  mockSessionInformation,
} from 'src/tests/test-utils';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;

  const mockSessions = [
    mockSession,
    {
      ...mockSession,
      id: 2,
      name: 'Advanced Yoga',
      description: 'For experienced practitioners',
    },
  ];

  beforeEach(async () => {
    jest.clearAllMocks();

    mockSessionApiService.all.mockReturnValue(of(mockSessions));

    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
      ],
    }).compileComponents();

    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should fetch all sessions on init', () => {
      expect(sessionApiService.all).toHaveBeenCalled();
    });

    it('should initialize sessions$ observable', (done) => {
      component.sessions$.subscribe((sessions) => {
        expect(sessions).toEqual(mockSessions);
        expect(sessions.length).toBe(2);
        done();
      });
    });
  });

  describe('user getter', () => {
    it('should return sessionInformation from sessionService', () => {
      expect(component.user).toEqual(mockSessionInformation);
    });

    it('should return admin status correctly', () => {
      expect(component.user?.admin).toBe(mockSessionInformation.admin);
    });

    it('should return current sessionInformation', () => {
      const currentInfo = mockSessionService.sessionInformation;

      expect(component.user).toBe(currentInfo);
    });
  });

  describe('Template integration - Non-admin user', () => {
    it('should not display create button for non-admin users', () => {
      const compiled = fixture.nativeElement;
      const createButton = compiled.querySelector(
        'button[routerLink="create"]'
      );

      expect(createButton).toBeNull();
    });

    it('should not display edit buttons for non-admin users', () => {
      const compiled = fixture.nativeElement;
      const editButtons = Array.from(
        compiled.querySelectorAll('button[color="primary"]')
      ).filter((btn: any) => btn.textContent.includes('Edit'));

      expect(editButtons.length).toBe(0);
    });
  });

  describe('Template integration - Admin user', () => {
    beforeEach(() => {
      mockSessionService.sessionInformation = {
        ...mockSessionInformation,
        admin: true,
      };
      fixture.detectChanges();
    });

    it('should display create button for admin users', () => {
      const compiled = fixture.nativeElement;
      const createButton = compiled.querySelector(
        'button[routerLink="create"]'
      );

      expect(createButton).toBeTruthy();
      expect(createButton.textContent).toContain('Create');
    });

    it('should display edit button for each session for admin users', () => {
      const compiled = fixture.nativeElement;
      const editButtons = compiled.querySelectorAll('button[color="primary"]');
      const editButtonsWithEditIcon = Array.from(editButtons).filter(
        (btn: any) => btn.textContent.includes('Edit')
      );

      expect(editButtonsWithEditIcon.length).toBeGreaterThan(0);
    });
  });

  describe('Template integration - Session list', () => {
    it('should display all sessions', () => {
      const compiled = fixture.nativeElement;
      const sessionCards = compiled.querySelectorAll('mat-card.item');

      expect(sessionCards.length).toBe(mockSessions.length);
    });

    it('should display session name', () => {
      const compiled = fixture.nativeElement;
      const sessionTitle = compiled.querySelector('div.items mat-card-title');

      expect(sessionTitle?.textContent).toContain(mockSessions[0].name);
    });

    it('should display session description', () => {
      const compiled = fixture.nativeElement;
      const sessionContent = compiled.querySelector(
        'div.items mat-card-content p'
      );

      expect(sessionContent?.textContent?.trim()).toBe(
        mockSessions[0].description
      );
    });

    it('should display detail button for each session', () => {
      const compiled = fixture.nativeElement;
      const detailButtons = Array.from(
        compiled.querySelectorAll('button[color="primary"]')
      ).filter((btn: any) => btn.textContent.includes('Detail'));

      expect(detailButtons.length).toBe(mockSessions.length);
    });
  });
});
