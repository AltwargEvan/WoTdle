const EST_TIMEZONE_OFFSET = 240 * 60 * 1000;

export const CurrentTimeAsEST = () => {
  const currentTimeAsEST = new Date(Date.now() - EST_TIMEZONE_OFFSET);
  return currentTimeAsEST;
};

export const timeTilNextDay = () => {
  const today = CurrentTimeAsEST();
  const hours = 23 - today.getUTCHours();
  const minutes = 59 - today.getUTCMinutes();
  const seconds = 59 - today.getUTCSeconds();
  return `${formatNum(hours)}:${formatNum(minutes)}:${formatNum(seconds)}`;
};

type DateCompareFn = (a: number, b: number) => boolean;
export const datesAreConsecutive: DateCompareFn = (aMs, bMs) => {
  const start = new Date(aMs);
  start.setDate(start.getDate() + 1);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCHours(23, 59, 59, 999);
  return bMs >= start.getTime() && bMs <= end.getTime();
};

export const datesAreInSameDay: DateCompareFn = (aMs, bMs) => {
  const a = new Date(aMs);
  const b = new Date(bMs);
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
};

const formatNum = (num: number) =>
  num.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });

export function dateString(date: Date) {
  date.setDate(date.getDate());
  return date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      timeZone: "America/New_York",
    })
    .replaceAll("/", "_");
}
