import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';
import { mockTeacher } from 'src/tests/test-utils';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  const baseUrl = 'api/teacher';
  const mockTeachers = [
    mockTeacher,
    {
      ...mockTeacher,
      id: 2,
      firstName: 'Sophie',
      lastName: 'Martin',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeacherService],
    });

    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('all', () => {
    it('should return all teachers via GET request', () => {
      service.all().subscribe((teachers) => {
        expect(teachers).toEqual(mockTeachers);
        expect(teachers.length).toBe(2);
      });

      const req = httpMock.expectOne(baseUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockTeachers);
    });
  });

  describe('detail', () => {
    it('should return a single teacher by id via GET request', () => {
      const teacherId = '1';

      service.detail(teacherId).subscribe((teacher) => {
        expect(teacher).toEqual(mockTeacher);
        expect(teacher.id).toBe(mockTeacher.id);
      });

      const req = httpMock.expectOne(`${baseUrl}/${teacherId}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.url).toBe(`${baseUrl}/${teacherId}`);

      req.flush(mockTeacher);
    });
  });
});
