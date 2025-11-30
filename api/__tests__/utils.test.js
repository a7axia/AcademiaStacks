/**
 * Unit tests for utility functions
 * Testing: error.js, tempEmailValidator.js
 * Uses: Mocks, Stubs, and Fakes
 */

import { createError } from '../utils/error.js';
import { isTemporaryEmail } from '../utils/tempEmailValidator.js';

describe('Utils - Error Handler', () => {
  /**
   * Test 1: createError function creates error with correct status
   */
  test('should create error object with correct status code', () => {
    const error = createError(404, 'Not Found');
    
    expect(error).toBeInstanceOf(Error);
    expect(error.status).toBe(404);
    expect(error.message).toBe('Not Found');
  });

  /**
   * Test 2: createError function handles different status codes
   */
  test('should create error with different status codes', () => {
    const error400 = createError(400, 'Bad Request');
    const error500 = createError(500, 'Internal Server Error');
    
    expect(error400.status).toBe(400);
    expect(error500.status).toBe(500);
  });
});

describe('Utils - Temporary Email Validator', () => {
  /**
   * Test 3: Detects known temporary email domains
   */
  test('should identify temporary email addresses', () => {
    // Testing with known temporary domains from the list
    expect(isTemporaryEmail('test@10minutemail.com')).toBe(true);
    expect(isTemporaryEmail('user@guerrillamail.com')).toBe(true);
    expect(isTemporaryEmail('fake@mytempmail.com')).toBe(true);
  });

  /**
   * Test 4: Accepts legitimate email addresses
   */
  test('should accept legitimate email addresses', () => {
    expect(isTemporaryEmail('user@gmail.com')).toBe(false);
    expect(isTemporaryEmail('student@university.edu')).toBe(false);
    expect(isTemporaryEmail('business@company.com')).toBe(false);
  });

  /**
   * Test 5: Handles invalid email formats
   */
  test('should return false for invalid email formats', () => {
    // No domain
    expect(isTemporaryEmail('invalidemail')).toBe(false);
    
    // No @ symbol
    expect(isTemporaryEmail('user.domain.com')).toBe(false);
    
    // Empty string
    expect(isTemporaryEmail('')).toBe(false);
    
    // Null/undefined
    expect(isTemporaryEmail(null)).toBe(false);
    expect(isTemporaryEmail(undefined)).toBe(false);
  });
});
