
const allstatus = [
  { label: "Sélectionnez un état", value: "" },
  { value: "1", label: "Payé" },
  { value: "2", label: "Impayé" },
  { value: "3", label: "Remboursé" },
  { value: "4", label: "Annulé" },
  { value: "5", label: "Non payé" },

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