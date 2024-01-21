export const todayAsInt = () => {
  const today = new Date();
  const year = formatNum(today.getUTCFullYear());
  const month = formatNum(1 + today.getUTCMonth());
  const day = formatNum(today.getUTCDate());
  return parseInt(`${day}${month}${year}`);
};

export const timeTilNextDay = () => {
  const today = new Date();
  const hours = today.getUTCHours();
  const minutes = today.getUTCMinutes();
  const seconds = today.getUTCSeconds();

  const hours_left = 23 - hours;
  let seconds_left = 60 - seconds;
  let minutes_left = 60 - minutes;
  if (seconds_left === 60) {
    minutes_left++;
    seconds_left = 0;
  }

  return `${formatNum(hours_left)}:${formatNum(minutes_left)}:${formatNum(
    seconds_left
  )}`;
};

const formatNum = (num: number) =>
  num.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
