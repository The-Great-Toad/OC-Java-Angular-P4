import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { AuthService } from './auth.service';
import { mockSessionInformation } from 'src/tests/test-utils';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { RegisterRequest } from '../interfaces/registerRequest.interface';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const baseUrl = 'api/auth';
  const mockLoginRequest: LoginRequest = {
    email: 'test@test.com',
    password: 'password123',
  };
  const mockRegisterRequest: RegisterRequest = {
    email: 'newuser@test.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'password123',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should register new user via POST request', () => {
      service.register(mockRegisterRequest).subscribe((response) => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${baseUrl}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.url).toBe(`${baseUrl}/register`);
      expect(req.request.body).toEqual(mockRegisterRequest);
      req.flush(null);
    });
  });

  describe('login', () => {
    it('should authenticate user via POST request', () => {
      service.login(mockLoginRequest).subscribe((response) => {
        expect(response).toEqual(mockSessionInformation);
        expect(response.token).toBeDefined();
      });

      const req = httpMock.expectOne(`${baseUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.url).toBe(`${baseUrl}/login`);
      expect(req.request.body).toEqual(mockLoginRequest);
      req.flush(mockSessionInformation);
    });
  });
});
