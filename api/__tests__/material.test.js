/**
 * Unit tests for Material Controller
 * Testing: material.js controller functions
 * Uses: Mocks and Stubs for Express and MongoDB
 */

import { jest } from '@jest/globals';

describe('Material Controller - Unit Tests', () => {
  let mockReq;
  let mockRes;
  let mockNext;
  let Material;
  let materialController;

  beforeEach(async () => {
    // Reset modules to get fresh imports
    jest.resetModules();

    // Create mock request, response, and next
    mockReq = {
      params: {},
      body: {},
      query: {}
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    mockNext = jest.fn();

    // Mock Material model
    Material = {
      findById: jest.fn(),
      findOne: jest.fn(),
      findByIdAndDelete: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      find: jest.fn(),
      countDocuments: jest.fn()
    };

    // Mock express-validator
    const mockValidationResult = jest.fn(() => ({
      isEmpty: () => true,
      array: () => []
    }));

    // Mock modules
    jest.unstable_mockModule('../models/Material.js', () => ({
      default: Material
    }));

    jest.unstable_mockModule('express-validator', () => ({
      validationResult: mockValidationResult,
      body: jest.fn(() => ({
        trim: jest.fn().mockReturnThis(),
        isLength: jest.fn().mockReturnThis(),
        isInt: jest.fn().mockReturnThis(),
        isArray: jest.fn().mockReturnThis(),
        isURL: jest.fn().mockReturnThis(),
        optional: jest.fn().mockReturnThis(),
        custom: jest.fn().mockReturnThis(),
        withMessage: jest.fn().mockReturnThis(),
        isMongoId: jest.fn().mockReturnThis(),
        isEmail: jest.fn().mockReturnThis(),
        normalizeEmail: jest.fn().mockReturnThis()
      })),
      param: jest.fn(() => ({
        isMongoId: jest.fn().mockReturnThis(),
        trim: jest.fn().mockReturnThis(),
        isLength: jest.fn().mockReturnThis(),
        withMessage: jest.fn().mockReturnThis()
      }))
    }));

    // Import controller functions after mocking
    materialController = await import('../controllers/material.js');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test 9: getMaterial retrieves material by ID successfully
   */
  test('should get material by ID successfully', async () => {
    const materialId = '507f1f77bcf86cd799439011';
    mockReq.params.id = materialId;

    const mockMaterial = {
      _id: materialId,
      subject: 'Data Structures',
      semester: 3,
      instructorName: ['Dr. Smith'],
      materialType: 'Notes',
      branch: ['CSE']
    };

    Material.findById.mockResolvedValue(mockMaterial);

    await materialController.getMaterial(mockReq, mockRes, mockNext);

    expect(Material.findById).toHaveBeenCalledWith(materialId);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockMaterial);
  });

  /**
   * Test 10: getMaterial handles non-existent material
   */
  test('should return 404 when material not found', async () => {
    mockReq.params.id = '507f1f77bcf86cd799439011';
    Material.findById.mockResolvedValue(null);

    await materialController.getMaterial(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 404,
        message: 'Material not found'
      })
    );
  });

  /**
   * Test 11: deleteMaterial successfully removes material
   */
  test('should delete material successfully', async () => {
    const materialId = '507f1f77bcf86cd799439011';
    mockReq.params.id = materialId;

    const mockDeletedMaterial = {
      _id: materialId,
      subject: 'Algorithms'
    };

    Material.findByIdAndDelete.mockResolvedValue(mockDeletedMaterial);

    await materialController.deleteMaterial(mockReq, mockRes, mockNext);

    expect(Material.findByIdAndDelete).toHaveBeenCalledWith(materialId);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('deleted successfully')
      })
    );
  });

  /**
   * Test 12: getMaterials filters by materialType
   */
  test('should filter materials by type', async () => {
    mockReq.query = { materialType: 'Notes' };
    
    const mockMaterials = [{ materialType: 'Notes' }];
    const mockLean = jest.fn().mockResolvedValue(mockMaterials);
    const mockSort = jest.fn().mockReturnThis();
    const mockLimit = jest.fn().mockReturnThis();
    const mockSkip = jest.fn().mockReturnValue({
      limit: mockLimit,
      sort: mockSort,
      lean: mockLean
    });

    Material.find.mockReturnValue({
      skip: mockSkip
    });

    Material.countDocuments.mockResolvedValue(1);

    await materialController.getMaterials(mockReq, mockRes, mockNext);

    expect(Material.find).toHaveBeenCalledWith(
      expect.objectContaining({
        materialType: 'Notes'
      })
    );
  });
});
