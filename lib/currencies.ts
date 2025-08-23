export const Currencies = [
  { value: "THB", label: "฿THB", locale: "th-TH" },
  { value: "USD", label: "$USD", locale: "en-US" },
  { value: "JPY", label: "¥JPY", locale: "jp-JP" },
];

export type Currency = (typeof Currencies)[0];
