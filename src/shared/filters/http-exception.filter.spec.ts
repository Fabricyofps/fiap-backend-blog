import { HttpExceptionFilter } from './http-exception.filter';
import { ArgumentsHost, HttpException } from '@nestjs/common';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockArgumentsHost: ArgumentsHost;
  let mockResponse: any;
  let mockRequest: any;
  let mockException: HttpException;

  beforeEach(() => {
    filter = new HttpExceptionFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = {
      url: '/test/url',
    };

    mockArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;

    mockException = {
      getStatus: jest.fn().mockReturnValue(400),
      message: 'Bad Request',
    } as unknown as HttpException;
  });

  it('should catch HttpException and send formatted JSON response', () => {
    filter.catch(mockException, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(400);

    const jsonResponse = mockResponse.json.mock.calls[0][0];

    expect(jsonResponse.statusCode).toBe(400);
    expect(typeof jsonResponse.timestamp).toBe('string');
    expect(jsonResponse.message).toBe('Bad Request');
    expect(jsonResponse.path).toBe('/test/url');
  });
});
