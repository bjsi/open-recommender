export function debounce<T extends (...args: any[]) => Promise<any>>(
  func: T,
  delay: number
): (...funcArgs: Parameters<T>) => Promise<ReturnType<T>> {
  let timer: number | undefined;
  let resolveFunc:
    | ((value: ReturnType<T> | PromiseLike<ReturnType<T>>) => void)
    | null = null;

  return function (...args: Parameters<T>): Promise<ReturnType<T>> {
    return new Promise<ReturnType<T>>((resolve) => {
      if (timer) clearTimeout(timer);
      resolveFunc = resolve;

      timer = window.setTimeout(async () => {
        const result = await func(...args);
        if (resolveFunc) resolveFunc(result);
      }, delay);
    });
  };
}
