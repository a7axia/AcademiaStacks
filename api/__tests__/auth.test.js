/**
 * Unit tests for Authentication Middleware
 * Testing: verifyToken.js middleware functions
 * Uses: Mocks for JWT and Express objects
 */

import { jest } from '@jest/globals';

describe('Authentication Middleware - Unit Tests', () => {
  let mockReq;
  let mockRes;
  let mockNext;
  let jwt;
  let verifyTokenModule;
  let createError;

  beforeEach(async () => {
    jest.resetModules();

    // Create mock request, response, and next
    mockReq = {
      cookies: {},
      params: {},
      user: null
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();

    // Mock jwt
    jwt = {
      verify: jest.fn()
    };

    // Mock createError
    createError = jest.fn((status, message) => {
      const error = new Error(message);
      error.status = status;
      return error;
    });

    // Mock modules
    jest.unstable_mockModule('jsonwebtoken', () => ({
      default: jwt
    }));

    jest.unstable_mockModule('dotenv', () => ({
      default: { config: jest.fn() }
    }));

    jest.unstable_mockModule('../utils/error.js', () => ({
      createError
    }));

    // Import after mocking
    verifyTokenModule = await import('../utils/verifyToken.js');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test 15: verifyToken successfully authenticates valid token
   */
  test('should authenticate user with valid token', () => {
    const mockToken = 'valid.jwt.token';
    const mockUser = {
      id: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      isAdmin: false
    };

    mockReq.cookies.access_token = mockToken;

    // Mock jwt.verify to call callback with user data
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, mockUser);
    });

    verifyTokenModule.verifyToken(mockReq, mockRes, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith(
      mockToken,
      process.env.JWT_SECRET,
      expect.any(Function)
    );
    expect(mockReq.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalledWith();
    expect(createError).not.toHaveBeenCalled();
  });
});
