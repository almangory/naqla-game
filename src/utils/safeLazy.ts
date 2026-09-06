/**
 * Safe Lazy Component Loader with Automatic Retry
 * Prevents ChunkLoadError / Network drops on mobile from causing White Screen
 */
import { lazy, ComponentType, LazyExoticComponent } from 'react';

export function safeLazy<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  retriesLeft = 2,
  interval = 1000
): LazyExoticComponent<T> {
  return lazy(() =>
    factory().catch((error) => {
      if (retriesLeft <= 0) {
        console.error('[safeLazy] Module failed after retries:', error);
        throw error;
      }
      return new Promise<{ default: T }>((resolve) => {
        setTimeout(() => {
          resolve(safeLazy(factory, retriesLeft - 1, interval) as any);
        }, interval);
      });
    })
  );
}
