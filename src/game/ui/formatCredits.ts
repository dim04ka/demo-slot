export const formatCredits = (value: number): string =>
  Math.trunc(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export const formatAutoCount = (count: number): string =>
  count === Number.POSITIVE_INFINITY ? "∞" : String(count);
