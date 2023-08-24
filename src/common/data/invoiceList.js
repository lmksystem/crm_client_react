
const allstatus = [
  { label: "Select Payment Status", value: "" },
  { label: "Impayé", value: "Impayé" },
  { label: "Payé", value: "Payé" },
  { label: "Annulé", value: "Annulé" },
  { label: "Remboursé", value: "Remboursé" },
];

const invoiceWidgets = [
  {
    id: 1,
    label: "Factures payées",
    percentage: "+8.09 %",
    percentageClass: "danger",
    icon: "ri-arrow-right-down-line",
    counter: "0",
    badge: "1,958",
    caption: "payées par les clients",
    feaIcon: "check-square",
    decimals: 2,
    prefix: "€",

  },
  {
    id: 2,
    label: "Factures impayées",
    percentage: "+9.01 %",
    percentageClass: "danger",
    icon: "ri-arrow-right-down-line",
    counter: "0",
    badge: "338",
    caption: "impayées par les clients",
    feaIcon: "clock",
    decimals: 5,
    prefix: "€",
    suffix: "k"
  },
  {
    id: 3,
    label: "Factures remboursées",
    percentage: "+89.24 %",
    percentageClass: "success",
    icon: "ri-arrow-right-up-line",
    counter: "0",
    badge: "2,258",
    caption: "factures remboursées",
    feaIcon: "file-text",
    decimals: 1,
    prefix: "€",
    suffix: "k"
  },


  {
    id: 4,
    label: "Factures annulées",
    percentage: "+7.55 %",
    percentageClass: "success",
    icon: "ri-arrow-right-up-line",
    counter: "0",
    badge: "502",
    caption: "Annulé par les clients",
    feaIcon: "x-octagon",
    decimals: 1,
    prefix: "€",
    suffix: "k"
  },
];


export { invoiceWidgets, allstatus };