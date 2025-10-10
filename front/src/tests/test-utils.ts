import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { User } from 'src/app/interfaces/user.interface';
import { Session } from 'src/app/features/sessions/interfaces/session.interface';
import { Teacher } from 'src/app/interfaces/teacher.interface';

// Mock data
export const mockUser: User = {
  id: 1,
  email: 'test@test.com',
  firstName: 'John',
  lastName: 'Doe',
  admin: false,
  password: 'password',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-02'),
};

export const mockAdminUser: User = {
  ...mockUser,
  admin: true,
};

export const mockTeacher: Teacher = {
  id: 1,
  firstName: 'Margot',
  lastName: 'Delahaye',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-02'),
};

export const mockSession: Session = {
  id: 1,
  name: 'Yoga Session',
  description: 'A relaxing yoga session',
  date: new Date('2024-01-15'),
  teacher_id: 1,
  users: [1, 2],
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-02'),
};

export const mockSessionInformation: SessionInformation = {
  token: 'mock-token',
  type: 'Bearer',
  id: 1,
  username: 'testuser',
  firstName: 'John',
  lastName: 'Doe',
  admin: false,
};

// Services Mocks
export const mockUserService = {
  getById: jest.fn(),
  delete: jest.fn(),
};

export const mockRouter = {
  navigate: jest.fn(),
};

export const mockMatSnackBar = {
  open: jest.fn(),
};

export const mockSessionService = {
  sessionInformation: mockSessionInformation,
  logIn: jest.fn(),
  logOut: jest.fn(),
  isLogged: false,
  $isLogged: jest.fn(),
};

export const mockAuthService = {
  login: jest.fn(),
  register: jest.fn(),
};

export const mockSessionApiService = {
  all: jest.fn(),
  detail: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  participate: jest.fn(),
  unParticipate: jest.fn(),
};

export const mockTeacherService = {
  all: jest.fn(),
  detail: jest.fn(),
};

export const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: jest.fn(),
    },
  },
};
