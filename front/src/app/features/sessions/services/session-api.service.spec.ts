import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import { mockSession } from 'src/tests/test-utils';

describe('SessionApiService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  const sessionId = '1';
  const userId = '42';
  const baseUrl = 'api/session';
  const sessionIdUrl = `${baseUrl}/${sessionId}`;
  const participateUrl = `${sessionIdUrl}/participate/${userId}`;
  const mockSessions = [
    mockSession,
    { ...mockSession, id: 2, name: 'Advanced Yoga' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionApiService],
    });

    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('all', () => {
    it('should return all sessions via GET request', () => {
      service.all().subscribe((sessions) => {
        expect(sessions).toEqual(mockSessions);
        expect(sessions.length).toBe(2);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockSessions);
    });
  });

  describe('detail', () => {
    it('should return a single session by id via GET request', () => {
      service.detail(sessionId).subscribe((session) => {
        expect(session).toEqual(mockSession);
        expect(session.id).toBe(mockSession.id);
      });

      const req = httpMock.expectOne(sessionIdUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.url).toBe(sessionIdUrl);
      req.flush(mockSession);
    });
  });

  describe('delete', () => {
    it('should delete a session via DELETE request', () => {
      service.delete(sessionId).subscribe((response) => {
        expect(response).toEqual({});
      });

      const req = httpMock.expectOne(sessionIdUrl);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.url).toBe(sessionIdUrl);
      req.flush({});
    });
  });

  describe('create', () => {
    it('should create a new session via POST request', () => {
      const newSession = { ...mockSession, id: undefined };

      service.create(newSession).subscribe((session) => {
        expect(session).toEqual(mockSession);
        expect(session.id).toBeDefined();
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.url).toBe(baseUrl);
      expect(req.request.body).toEqual(newSession);
      req.flush(mockSession);
    });
  });

  describe('update', () => {
    it('should update an existing session via PUT request', () => {
      const updatedSession = { ...mockSession, name: 'Updated Yoga' };

      service.update(sessionId, updatedSession).subscribe((session) => {
        expect(session).toEqual(updatedSession);
        expect(session.name).toBe('Updated Yoga');
      });

      const req = httpMock.expectOne(sessionIdUrl);
      expect(req.request.method).toBe('PUT');
      expect(req.request.url).toBe(sessionIdUrl);
      expect(req.request.body).toEqual(updatedSession);
      req.flush(updatedSession);
    });
  });

  describe('participate', () => {
    it('should add user to session via POST request', () => {
      service.participate(sessionId, userId).subscribe((response) => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(participateUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.url).toBe(participateUrl);
      expect(req.request.body).toBeNull();
      req.flush(null);
    });
  });

  describe('unParticipate', () => {
    it('should remove user from session via DELETE request', () => {
      service.unParticipate(sessionId, userId).subscribe((response) => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(participateUrl);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.url).toBe(participateUrl);
      req.flush(null);
    });
  });
});
