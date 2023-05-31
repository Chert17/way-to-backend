export const addMinutesToCurrentDate = (minutes: number) =>
  new Date(new Date().getTime() + 60000 * minutes);
