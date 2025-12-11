export function calculatePeriodEnd(
  startAtIso: string | undefined,
  defaultOffsetDays = 7
) {
  if (!startAtIso) return undefined;
  const d = new Date(startAtIso);
  if (isNaN(d.getTime())) return undefined;
  d.setDate(d.getDate() + defaultOffsetDays);
  return d.toISOString().slice(0, 16);
}

export function calculateSessionCount(
  startAtIso: string | undefined,
  periodEndIso: string | undefined,
  period: "EVERY_DAY" | "EVERY_WEEK"
): number | null {
  if (!startAtIso || !periodEndIso) return null;
  const start = new Date(startAtIso);
  const end = new Date(periodEndIso);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start)
    return null;
  const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  return period === "EVERY_DAY"
    ? Math.floor(diffDays) + 1
    : Math.floor(diffDays / 7) + 1;
}
