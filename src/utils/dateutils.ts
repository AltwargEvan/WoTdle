export const todayAsInt = () => {
  const today = new Date();
  const year = formatNum(today.getUTCFullYear());
  const month = formatNum(1 + today.getUTCMonth());
  const day = formatNum(today.getUTCDate());
  return parseInt(`${day}${month}${year}`);
};

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

const formatNum = (num: number) =>
  num.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
