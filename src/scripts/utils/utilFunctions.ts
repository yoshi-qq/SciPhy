export function invertMap<K, V>(originalMap: Map<K, V>): Map<V, K> {
  const invertedMap = new Map();
  for (const [key, value] of originalMap.entries()) {
    invertedMap.set(value, key);
  }
  return invertedMap;
}