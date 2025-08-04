import { PrometheusService } from './prometheus.service';
import * as prometheus from 'prom-client';

describe('PrometheusService', () => {
  let service: PrometheusService;

  beforeEach(() => {
    prometheus.register.clear();

    service = new PrometheusService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should instantiate a Histogram', () => {
    const histogram = service.sendMetrics;
    expect(histogram).toBeInstanceOf(prometheus.Histogram);
  });

  it('sendMetrics getter should return the same histogram instance', () => {
    const firstCall = service.sendMetrics;
    const secondCall = service.sendMetrics;
    expect(firstCall).toBe(secondCall);
  });
});
