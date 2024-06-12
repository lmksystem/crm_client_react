import React, { useEffect } from "react";
import CountUp from "react-countup";
import { Card, CardBody, Col, UncontrolledTooltip } from "reactstrap";

import { useSelector } from "react-redux";
import moment from "moment";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
moment.locale("fr");

const Widgets = () => {
  const { transactionsPeriodPrice, devisCountPeriod, invoiceCountPeriod, entityCountPeriod, devise, invoices } = useSelector((state) => ({
    transactionsPeriodPrice: state.Transaction.transactionsPeriodPrice,
    devisCountPeriod: state.Devis.devisCountPeriod,
    invoiceCountPeriod: state.Invoice.invoiceCountPeriod,
    entityCountPeriod: state.Gestion.entityCountPeriod,
    devise: state.Company.devise,
    invoices: state.Invoice.invoices
  }));

  function constructWidgetDetails(label, value) {
    if (label === "badge" && value) {
      if (value > 0) {
        return "ri-arrow-right-up-line";
      } else if (value < 0) {
        return "ri-arrow-right-down-line";
      } else {
        return null;
      }
    } else if (label === "badgeClass" && value) {
      if (value > 0) {
        return "success";
      } else if (value < 0) {
        return "danger";
      } else {
        return "muted";
      }
    }
    return null;
  }

  const ecomWidgets = [
    {
      id: 1,
      cardColor: "primary",
      label: "Ventes",
      badge: constructWidgetDetails("badge", transactionsPeriodPrice?.pourcentage_gain_perte),
      badgeClass: constructWidgetDetails("badgeClass", transactionsPeriodPrice?.pourcentage_gain_perte),
      percentage: transactionsPeriodPrice?.pourcentage_gain_perte || 0,
      counter: transactionsPeriodPrice?.ventes_courantes || 0,
      bgcolor: "primary",
      decimals: 2,
      prefix: "",
      suffix: devise,
      separator: " ",
      decimal: ",",
      icon: "dollar-sign",
      desc: "Total des transactions payait pendant la période sélectionnée"
    },
    {
      id: 2,
      cardColor: "secondary",
      label: "Devis",
      badge: constructWidgetDetails("badge", devisCountPeriod?.pourcentage_gain_perte),
      badgeClass: constructWidgetDetails("badgeClass", devisCountPeriod?.pourcentage_gain_perte),
      percentage: devisCountPeriod?.pourcentage_gain_perte || 0,
      counter: devisCountPeriod?.nb_devis_annee_courante || 0,
      bgcolor: "primary",
      decimals: 0,
      prefix: "",
      suffix: "",
      separator: " ",
      icon: "clipboard",
      desc: "Nombre total des devis réalisait lors de la période sélectionnée"
    },
    {
      id: 3,
      cardColor: "success",
      label: "Factures",
      badge: constructWidgetDetails("badge", invoiceCountPeriod?.pourcentage_gain_perte),
      badgeClass: constructWidgetDetails("badgeClass", invoiceCountPeriod?.pourcentage_gain_perte),
      percentage: invoiceCountPeriod?.pourcentage_gain_perte || 0,
      counter: invoiceCountPeriod?.nb_invoice_annee_courante || 0,
      bgcolor: "primary",
      decimals: 0,
      prefix: "",
      suffix: "",
      icon: "file-text",
      desc: "Nombre total des Factures réaliser lors de la période sélectionnée"
    },
    {
      id: 4,
      cardColor: "info",
      label: "Fournisseurs",
      badge: constructWidgetDetails("badge", entityCountPeriod?.pourcentage_gain_perte),
      badgeClass: constructWidgetDetails("badgeClass", entityCountPeriod?.pourcentage_gain_perte),
      icon: "users",
      percentage: entityCountPeriod?.pourcentage_gain_perte || 0,
      counter: entityCountPeriod?.nb_entity_annee_courante || 0,
      bgcolor: "primary",
      decimals: 0,
      desc: "Nombre total des fournisseurs enregistraient lors de la période sélectionnée"
    }
  ];

  useEffect(() => {
    // if (invoices.length > 0) {
    //   let invoicePaid = invoices.filter((i) => i.header.fen_etat == 1 && i.header);
    //   console.log(invoicePaid);
    // }
  }, [invoices]);

  return (
    <React.Fragment>
      {ecomWidgets?.map((item, key) => (
        <Col
          xl={3}
          md={6}
          key={key}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <p
                    className="text-uppercase fw-medium text-truncate mb-0"
                    style={{ color: "#ff9f00" }}>
                    {item.label}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <h5 className={"fs-14 mb-0 text-" + item.badgeClass}>
                    {item.badge ? <i className={"fs-13 align-middle " + item.badge}></i> : null} {item.percentage} %
                  </h5>
                </div>
              </div>
              <div className="d-flex align-items-end justify-content-between mt-4">
                <div>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                    <span
                      className="counter-value"
                      data-target="559.25">
                      <CountUp
                        start={0}
                        prefix={item.prefix}
                        suffix={item.suffix}
                        separator={item.separator}
                        end={item.counter}
                        decimals={item.decimals}
                        decimal={item.decimal}
                        duration={1}
                      />
                      <div style={{ position: "absolute", top: -3, right: 2 }} className="d-flex align-items-center justify-content-center">
                        <a id={"ScheduleUpdateTooltip" + key}><i class="bx bx-info-circle fs-5 text-primary"></i></a>
                        <UncontrolledTooltip
                          placement="top"
                          target={"ScheduleUpdateTooltip" + key}
                          trigger="hover"
                        >{item.desc}</UncontrolledTooltip>
                      </div>
                    </span>
                  </h4>
                </div>
                {item?.icon && (
                  <div className="avatar-sm flex-shrink-0">
                    <span className="avatar-title bg-light rounded fs-3">
                      <FeatherIcon
                        icon={item.icon}
                        className="text-success icon-dual-success"
                      />
                    </span>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </React.Fragment>
  );
};

export default Widgets;
