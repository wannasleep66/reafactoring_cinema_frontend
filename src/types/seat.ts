export const SeatStatusValues = {
  Available: "AVAILABLE",
  Reserved: "RESERVED",
  Sold: "SOLD",
  Cancelled: "CANCELLED",
} as const;

export type SeatStatus =
  (typeof SeatStatusValues)[keyof typeof SeatStatusValues];

export function isTaken(status: SeatStatus | string | undefined): boolean {
  if (!status) return false;
  return status !== SeatStatusValues.Available;
}

export default {} as const;
