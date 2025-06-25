export function firestoreTimestampToDate(timestamp: { seconds: number, nanoseconds: number }): Date {
  return new Date(timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1_000_000));
}
