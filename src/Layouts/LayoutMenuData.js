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
  }, [
    history,
    iscurrentState,
    isBanque,
    isComptability,
    isFacture,
    isGestion,
    isPaie,
    isRapport,
    isEmployee,
  ]);

  const menuItems = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "dashboard",
      label: "Tableau de bord",
      icon: "las la-tachometer-alt",
      link: "/#",
    },
    {
      id: "gestion",
      label: "Gestion",
      icon: "bx bxs-user-detail",
      link: "/gestions",
      click: function (e) {
        e.preventDefault();
        setIsGestion(!isGestion);
        setIscurrentState("Gestions");
      },
      stateVariables: isGestion,
      subItems: [
        {
          id: "clients-fournisseurs",
          label: "Cliens / Fournisseurs",
          link: "/client-fournisseur",
          parentId: "gestion",
        },
        {
          id: "contacts",
          label: "Contacts",
          link: "/contacts",
          parentId: "gestion",
        },
        {
          id: "produits",
          label: "Produits",
          link: "/produits",
          parentId: "gestion",
        },
      ],
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
          parentId: "facturation",
        },
        {
          id: "invoices",
          label: "Factures",
          link: "/factures/liste",
          parentId: "facturation",
        },

        {
          id: "reglements",
          label: "Règlements",
          link: "/transaction/liste",
          parentId: "facturation",
        },
        {
          id: "recurrence",
          label: "Récurrence",
          link: "/recurrence",
          parentId: "facturation",
        },
      ],
    },
    {
      id: "comptability",
      label: "Comptabilité",
      icon: "bx bx-coin-stack",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsComptability(!isComptability);
        setIscurrentState("Comptabilité");

      },
      stateVariables: isComptability,
      subItems: [
        {
          id: "export",
          label: "Export",
          link: "/export",
          isChildItem: false,
          click: function (e) { },
          parentId: "comptability",
        },
      ],
    },
    {
      id: "banque",
      label: "Banque / Achat",
      icon: "mdi mdi-bank",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsBanque(!isBanque);
        setIscurrentState("Banque");

      },
      stateVariables: isBanque,
      subItems: [
        {
          id: "factures-achats",
          label: "Mes comptes bancaires",
          link: "/bankaccount",
          parentId: "banque",
        },
        {
          id: "transactions-bancaires",
          label: "Transactions bancaires",
          link: "/transaction/bank",
          parentId: "banque",
        },
        {
          id: "factures-achats",
          label: "Factures Achats",
          link: "/achat",
          parentId: "banque",
        },
      ],
    },
    {
      id: "rapports",
      label: "Rapports - WIP",
      icon: "las la-file-alt",
      link: "/rapports",
      click: function (e) {
        e.preventDefault();
        setIsRapport(!isRapport);
        setIscurrentState("Rapports");

      },
      stateVariables: isRapport,
      // subItems: [],
    },
    {
      id: "employee",
      label: "Employés",
      icon: "las la-address-book",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsEmployee(!isEmployee);
        setIscurrentState("Employés");

      },
      stateVariables: isEmployee,
      subItems: [
        {
          id: "liste-employee",
          label: "Liste des employés",
          link: "/employees",
          parentId: "employee",
        },
        {
          id: "salaires",
          label: "Salaires",
          link: "/salary",
          parentId: "employee",
        },
      ],
    },
    {
      id: "getion-parameter",
      label: "Paramétrage",
      link: "/gestion/parametre",
      icon: "mdi mdi-cog-outline",
    },
  ];

  let menuItemsAdmin = [
    {
      id: "admin-dashboard",
      label: "Admin",
      link: "/admin",
      icon: "mdi mdi-cog-outline",
    },
    {
      id: "user-admin",
      label: "Utilisateurs",
      link: "/admin/users",
      icon: "las la-address-book",
      click: function (e) {
        e.preventDefault();
        setIsUserAdmin(!isUserAdmin);
        setIscurrentState("UserAdmin");
      },
      stateVariables: isUserAdmin,
    },
  ]

  return <React.Fragment>{userProfile.use_rank == 0 ? menuItems : menuItemsAdmin}</React.Fragment>;
};
export default Navdata;
