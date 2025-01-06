export function getAllPairs<T>(list: T[]): [T, T][] {
  const pairs: [T, T][] = [];
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      pairs.push([list[i], list[j]]);
    }
  }
  return pairs;
}