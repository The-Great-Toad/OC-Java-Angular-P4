import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { UserService } from './user.service';
import { mockUser } from 'src/tests/test-utils';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const userId = '1';
  const baseUrl = 'api/user';
  const userIdUrl = `${baseUrl}/${userId}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getById', () => {
    it('should return a user by id via GET request', () => {
      service.getById(userId).subscribe((user) => {
        expect(user).toEqual(mockUser);
        expect(user.id).toBe(mockUser.id);
      });

      const req = httpMock.expectOne(userIdUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.url).toBe(userIdUrl);
      req.flush(mockUser);
    });
  });

  describe('delete', () => {
    it('should delete a user via DELETE request', () => {
      service.delete(userId).subscribe((response) => {
        expect(response).toEqual({});
      });

      const req = httpMock.expectOne(userIdUrl);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.url).toBe(userIdUrl);
      req.flush({});
    });
  });
});
