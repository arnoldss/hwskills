export function isNullOrUndefined(val) {
  return val == null;
}

export function isNullOrEmpty(iterable) {
  return iterable == null || iterable.length <= 0;
}

export function parseFirestoreTimestamp(timestamp: { seconds: number; nanoseconds: number }) {
  return new Date(timestamp.seconds * 1000);
}
