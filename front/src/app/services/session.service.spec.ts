import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { mockSessionInformation } from 'src/tests/test-utils';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial state', () => {
    it('should initialize with isLogged set to false', () => {
      expect(service.isLogged).toBe(false);
    });

    it('should initialize with sessionInformation undefined', () => {
      expect(service.sessionInformation).toBeUndefined();
    });

    it('should emit false on $isLogged observable initially', (done) => {
      service.$isLogged().subscribe((isLogged) => {
        expect(isLogged).toBe(false);
        done();
      });
    });
  });

  describe('logIn', () => {
    it('should set sessionInformation with provided user data', () => {
      service.logIn(mockSessionInformation);

      expect(service.sessionInformation).toEqual(mockSessionInformation);
    });

    it('should set isLogged to true', () => {
      service.logIn(mockSessionInformation);

      expect(service.isLogged).toBe(true);
    });

    it('should emit true on $isLogged observable', (done) => {
      let emissionCount = 0;

      service.$isLogged().subscribe((isLogged) => {
        emissionCount++;
        if (emissionCount === 1) {
          expect(isLogged).toBe(false);
        }
        if (emissionCount === 2) {
          expect(isLogged).toBe(true);
          done();
        }
      });

      service.logIn(mockSessionInformation);
    });

    it('should update sessionInformation when called multiple times', () => {
      const firstSession = mockSessionInformation;
      const secondSession = {
        ...mockSessionInformation,
        id: 2,
        username: 'seconduser',
      };

      service.logIn(firstSession);
      expect(service.sessionInformation).toEqual(firstSession);

      service.logIn(secondSession);
      expect(service.sessionInformation).toEqual(secondSession);
    });
  });

  describe('logOut', () => {
    beforeEach(() => {
      service.logIn(mockSessionInformation);
    });

    it('should set sessionInformation to undefined', () => {
      service.logOut();

      expect(service.sessionInformation).toBeUndefined();
    });

    it('should set isLogged to false', () => {
      service.logOut();

      expect(service.isLogged).toBe(false);
    });

    it('should emit false on $isLogged observable', (done) => {
      let emissionCount = 0;

      service.$isLogged().subscribe((isLogged) => {
        emissionCount++;
        if (emissionCount === 1) {
          expect(isLogged).toBe(true);
        }
        if (emissionCount === 2) {
          expect(isLogged).toBe(false);
          done();
        }
      });

      service.logOut();
    });
  });
});
