import numeral from "numeral";

export const formatNumber = (value: number | string, format: string = "0,0") => {
  if (value === null || value === undefined || isNaN(Number(value))) return "--";
  return numeral(value).format(format);
};
