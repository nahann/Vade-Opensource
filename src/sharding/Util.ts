export function chunk<T>(values: T[], size: number): T[][] {
  const result = [];
  const amount = (values.length / size) | 0;
  const mod = values.length % size;

  for (let i = 0; i < size; i++) {
    result[i] = values.splice(0, i < mod ? amount + 1 : amount);
  }

  return result;
}
