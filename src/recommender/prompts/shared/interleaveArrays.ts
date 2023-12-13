export function interleaveArrays<T>(array1: T[], array2: T[]) {
  let result = [];
  let maxLength = Math.max(array1.length, array2.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < array1.length) {
      result.push(array1[i]);
    }
    if (i < array2.length) {
      result.push(array2[i]);
    }
  }

  return result;
}
