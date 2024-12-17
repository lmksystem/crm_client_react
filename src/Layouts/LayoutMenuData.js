import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../Components/Hooks/UserHooks";

const Navdata = () => {
  const { userProfile } = useProfile();
  const history = useNavigate();
  //state data
  const [isGestion, setIsGestion] = useState(false);
  const [isFacture, setIsFacture] = useState(false);
  const [isComptability, setIsComptability] = useState(false);
  const [isBanque, setIsBanque] = useState(false);
  const [isRapport, setIsRapport] = useState(false);
  const [isPaie, setIsPaie] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);

  const [isUserAdmin, setIsUserAdmin] = useState(false);

  // Pages
  const [isProfile, setIsProfile] = useState(false);
  const [isLanding, setIsLanding] = useState(false);

  // Charts
  const [isApex, setIsApex] = useState(false);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  useEffect(() => {
    // document.body.classList.add("twocolumn-panel");

    if (iscurrentState !== "Gestions") {
      setIsGestion(false);
    }
    if (iscurrentState !== "Banque") {
      setIsBanque(false);
    }
    if (iscurrentState !== "Facturation") {
      setIsFacture(false);
    }
    if (iscurrentState !== "Paie") {
      setIsPaie(false);
    }
    if (iscurrentState !== "Rapports") {
      setIsRapport(false);
    }
    if (iscurrentState !== "Comptabilité") {
      setIsComptability(false);
    }
    if (iscurrentState !== "Employés") {
      setIsEmployee(false);
    }
    if (isUserAdmin !== "UserAdmin") {
      setIsUserAdmin(false);
    }
  }, [history, iscurrentState, isBanque, isComptability, isFacture, isGestion, isPaie, isRapport, isEmployee]);

  const menuItems = [
    {
      label: "Menu",
      isHeader: true
    },
    {
      id: "dashboard",
      label: "Tableau de bord",
      icon: "las la-tachometer-alt",
      link: "/"
    },

    {
      id: "facturation",
      label: "Facturation",
      icon: "las la-file-invoice-dollar",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsFacture(!isFacture);
        setIscurrentState("Facturation");
      },
      stateVariables: isFacture,
      subItems: [
        {
          id: "devis",
          label: "Devis",
          link: "/devis/liste",
          parentId: "facturation"
        },
        {
          id: "invoices",
          label: "Factures",
          link: "/factures/liste",
          parentId: "facturation"
        },
        // {
        //   id: "recurrence",
        //   label: "Récurrences",
        //   link: "/recurrence",
        //   parentId: "facturation"
        // },
        {
          id: "reglements",
          label: "Encaissements",
          link: "/transaction/liste",
          parentId: "facturation"
        }
      ]
    }
  ];

  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
