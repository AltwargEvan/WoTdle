export const todayAsInt = () => {
  const today = new Date();
  const year = today.getFullYear();
  let month = 1 + today.getMonth().toString();
  month = month.length > 1 ? month : "0" + month;
  let day = today.getDate().toString();
  day = day.length > 1 ? day : "0" + day;
  return parseInt(`${day}${month}${year}`);
};
