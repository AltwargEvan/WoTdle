export const todayAsInt = () => {
  const today = new Date();
  const year = formatNum(today.getUTCFullYear());
  const month = formatNum(1 + today.getUTCMonth());
  const day = formatNum(today.getUTCDate());
  return parseInt(`${day}${month}${year}`);
};

export const timeTilNextDay = () => {
  const today = new Date().toLocaleTimeString("en-GB", {
    timeZone: "America/New_York",
  });
  const [hours, minutes, seconds] = today.split(":");
  let secondsTilNextDay =
    24 * 60 * 60 -
    parseInt(hours) * 3600 -
    parseInt(minutes) * 60 -
    parseInt(seconds);
  const hours_left = Math.floor(secondsTilNextDay / 3600);
  secondsTilNextDay = secondsTilNextDay % 3600;
  const minutes_left = Math.floor(secondsTilNextDay / 60);
  secondsTilNextDay = secondsTilNextDay % 60;
  return `${formatNum(hours_left)}:${formatNum(minutes_left)}:${formatNum(
    secondsTilNextDay
  )}`;
};

const formatNum = (num: number) =>
  num.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
