export const sliceString = (str: string, maxLength: number) => {
  if (!str || str === "null") {
    return "";
  }
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength) + "...";
};
