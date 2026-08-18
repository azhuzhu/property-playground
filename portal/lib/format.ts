export const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
