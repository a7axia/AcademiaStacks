/**
 * Simplified Unit Tests for Validation Functions
 * Testing validation logic without complex mocking
 */

import { isTemporaryEmail, validateEmailForRegistration } from '../utils/tempEmailValidator.js';
import { createError } from '../utils/error.js';

describe('Email Validation - Extended Tests', () => {
  /**
   * Test 5: validateEmailForRegistration with valid email
   */
  test('should validate correct email format', () => {
    const result = validateEmailForRegistration('student@university.edu');
    
    expect(result.isValid).toBe(true);
    expect(result.message).toBe('Email is valid');
  });

  /**
   * Test 6: validateEmailForRegistration rejects temporary emails
   */
  test('should reject temporary email addresses', () => {
    const result = validateEmailForRegistration('test@guerrillamail.com');
    
    expect(result.isValid).toBe(false);
    expect(result.message).toContain('permanent email');
  });

  /**
   * Test 7: validateEmailForRegistration handles invalid format
   */
  test('should reject invalid email formats', () => {
    const invalidEmails = ['', 'notanemail', '@domain.com'];

    invalidEmails.forEach(email => {
      const result = validateEmailForRegistration(email);
      expect(result.isValid).toBe(false);
    });
  });
});

describe('Error Utility - Extended Tests', () => {
  /**
   * Test 8: createError with common HTTP status codes
   */
  test('should create errors for common HTTP status codes', () => {
    const error400 = createError(400, 'Bad Request');
    const error404 = createError(404, 'Not Found');
    
    expect(error400.status).toBe(400);
    expect(error404.status).toBe(404);
  });
});