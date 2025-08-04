import { LoggingInterceptor } from './logging.interceptor';
import { PrometheusService } from '../services/prometheus.service';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;
  let prometheusService: PrometheusService;

  beforeEach(() => {
    prometheusService = {
      sendMetrics: {
        labels: jest.fn().mockReturnValue({
          observe: jest.fn(),
        }),
      },
    } as any;

    interceptor = new LoggingInterceptor(prometheusService);
  });

  it('should call prometheus observe with route path and duration', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          route: { path: '/test-route' },
        }),
      }),
    } as unknown as ExecutionContext;

    const mockCallHandler: CallHandler = {
      handle: () => of('response'),
    };

    const labelsSpy = jest.spyOn(prometheusService.sendMetrics, 'labels');
    const observeMock = jest.fn();
    labelsSpy.mockReturnValue({
      observe: observeMock,
      startTimer: function (): (
        labels?: Partial<Record<'route', string | number>> | undefined,
      ) => void {
        throw new Error('Function not implemented.');
      },
    });

    const before = Date.now();

    const result = interceptor.intercept(mockContext, mockCallHandler);

    const observable = result instanceof Promise ? await result : result;

    observable.subscribe({
      next: () => {
        expect(labelsSpy).toHaveBeenCalledWith('/test-route');
        expect(observeMock).toHaveBeenCalled();
        const duration = observeMock.mock.calls[0][0];
        expect(duration).toBeGreaterThanOrEqual(0);
        expect(duration).toBeLessThanOrEqual((Date.now() - before) / 1000);
      },
    });
  });
});
