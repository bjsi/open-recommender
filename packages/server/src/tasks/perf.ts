export async function withPerformanceMeasure<T>(
  name: string,
  fn: () => Promise<T>,
  logger: { info: (msg: string) => void } = console
): Promise<T> {
  performance.mark(`start:${name}`);
  const res = await fn();
  performance.mark(`end:${name}`);
  const measure = performance.measure(name, `start:${name}`, `end:${name}`);
  logger.info(`${name} completed in ${measure.duration}ms`);
  return res;
}
