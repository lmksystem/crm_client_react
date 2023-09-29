import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isGestion, setIsGestion] = useState(false);
  const [isFacture, setIsFacture] = useState(false);
  const [isComptability, setIsComptability] = useState(false);
  const [isBanque, setIsBanque] = useState(false);
  const [isRapport, setIsRapport] = useState(false);
  const [isPaie, setIsPaie] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);


  // Authentication
  const [isSignIn, setIsSignIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isPasswordCreate, setIsPasswordCreate] = useState(false);
  const [isLockScreen, setIsLockScreen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [isVerification, setIsVerification] = useState(false);
  const [isError, setIsError] = useState(false);

  // Pages
  const [isProfile, setIsProfile] = useState(false);
  const [isLanding, setIsLanding] = useState(false);

  // Charts
  const [isApex, setIsApex] = useState(false);

  // Multi Level
  const [isLevel1, setIsLevel1] = useState(false);
  const [isLevel2, setIsLevel2] = useState(false);

  const [iscurrentState, setIscurrentState] = useState('Dashboard');

  function updateIconSidebar(e) {
    // // document.querySelectorAll("#navbar-bar a[aria-expanded=true]").setAttribute("aria-expanded", "false")
    // e.target.setAttribute('aria-expanded', "true");
    // if (e && e.target && e.target.getAttribute("subitems")) {

    //   const ul = document.getElementById("two-column-menu");
    //   const iconItems = ul.querySelectorAll(".nav-icon.active");
    //   let activeIconItems = [...iconItems];
    //   activeIconItems.forEach((item) => {
    //     item.classList.remove("active");
    //     var id = item.getAttribute("subitems");
    //     if (document.getElementById(id))
    //       document.getElementById(id).classList.remove("show");
    //   });
    // }
  }

  useEffect(() => {
    document.body.classList.remove('twocolumn-panel');

    if (iscurrentState !== 'Gestions') {
      setIsGestion(false);
    }
    if (iscurrentState !== 'Banque') {
      setIsBanque(false);
    }
    if (iscurrentState !== 'Facturation') {
      setIsFacture(false);
    }
    if (iscurrentState !== 'Paie') {
      setIsPaie(false);
    }
    if (iscurrentState !== 'Rapports') {
      setIsRapport(false);
    }
    if (iscurrentState !== 'Comptabilité') {
      setIsComptability(false);
    }
    if(iscurrentState !== 'Employés') {
      setIsEmployee(false)
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
      label: "Dashboards",
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
        setIscurrentState('Gestions');
        updateIconSidebar(e);
      },
      stateVariables: isGestion,
      subItems: [
        {
          id: "clients-fournisseurs",
          label: "Client / Fournisseur",
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
        {
          id: "getion-parameter",
          label: "Paramètre",
          link: "/gestion/parametre",
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
        setIscurrentState('Facturation');
        updateIconSidebar(e);
      },
      stateVariables: isFacture,
      subItems: [
        {
          id: "devis",
          label: "Devis",
          link: "/devis/liste",
          isChildItem: false,
          parentId: "facturation",

        },
        {
          id: "invoices",
          label: "Factures",
          link: "/factures/liste",
          isChildItem: false,
          parentId: "facturation",

        },

        {
          id: "reglements",
          label: "Règlements",
          link: "/transaction/liste",
          isChildItem: false,
          parentId: "facturation",

        },
        {
          id: "recurrence",
          label: "Recurrence",
          link: "/recurrence",
          isChildItem: false,
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
        setIscurrentState('Comptabilité');
        updateIconSidebar(e);
      },
      stateVariables: isComptability,
      subItems: [
        {
          id: "export",
          label: "Export",
          link: "/#",
          isChildItem: false,
          click: function (e) {
          },
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
        setIscurrentState('Banque');
        updateIconSidebar(e);
      },
      stateVariables: isBanque,
      subItems: [
        {
          id: "factures-achats",
          label: "Mes comptes bancaires",
          link: "/accountbank",
          isChildItem: false,
          click: function (e) {
            e.preventDefault();

          },
          parentId: "banque",
        },
        {
          id: "transactions-bancaires",
          label: "Transactions bancaires",
          link: "/transaction/bank",
          isChildItem: false,
          click: function (e) {
            e.preventDefault();

          },
          parentId: "banque",
        },
        {
          id: "factures-achats",
          label: "Factures Achats",
          link: "/achat",
          isChildItem: false,
          click: function (e) {
            e.preventDefault();

          },
          parentId: "banque",
        },
       

      ],
    },
    {
      id: "rapports",
      label: "Rapports - WIP",
      icon: "las la-file-alt",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsRapport(!isRapport);
        setIscurrentState('Rapports');
        updateIconSidebar(e);
      },
      stateVariables: isRapport,
      subItems: [

      ],
    },
    {
      id: "employee",
      label: "Employés",
      icon: "las la-address-book",
      link: "/#",
      click: function (e) {
        e.preventDefault();
        setIsEmployee(!isEmployee);
        setIscurrentState('Employés');
        updateIconSidebar(e);
      },
      stateVariables: isEmployee,
      subItems: [

       
        {
          id: "liste-employee",
          label: "Liste employé",
          link: "/employees",
          isChildItem: false,
          click: function (e) {
            e.preventDefault();

          },
          parentId: "employee",
        },
        {
          id: "salaires",
          label: "Salaires",
          link: "/salary",
          isChildItem: false,
          click: function (e) {
            e.preventDefault();

          },
          parentId: "employee",
        },

      ],
    },

  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;