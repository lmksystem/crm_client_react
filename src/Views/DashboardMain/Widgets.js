import React from "react";
import CountUp from "react-countup";
import { Card, CardBody, Col } from "reactstrap";

import { useSelector } from "react-redux";
import moment from "moment";
moment.locale("fr");

const Widgets = () => {

  const {
    transactionsPeriodPrice,
    devisCountPeriod,
    invoiceCountPeriod,
    entityCountPeriod,
  } = useSelector((state) => ({
    transactionsPeriodPrice: state.Transaction.transactionsPeriodPrice,
    devisCountPeriod: state.Devis.devisCountPeriod,
    invoiceCountPeriod: state.Invoice.invoiceCountPeriod,
    entityCountPeriod: state.Gestion.entityCountPeriod,
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
      label: "Total ventes",
      badge: constructWidgetDetails(
        "badge",
        transactionsPeriodPrice?.pourcentage_gain_perte
      ),
      badgeClass: constructWidgetDetails(
        "badgeClass",
        transactionsPeriodPrice?.pourcentage_gain_perte
      ),
      percentage: transactionsPeriodPrice?.pourcentage_gain_perte || 0,
      counter: transactionsPeriodPrice?.ventes_courantes || 0,
      bgcolor: "primary",
      icon: "bx bx-dollar-circle",
      decimals: 2,
      prefix: "",
      suffix: "€",
    },
    {
      id: 2,
      cardColor: "secondary",
      label: "Devis",
      badge: constructWidgetDetails(
        "badge",
        devisCountPeriod?.pourcentage_gain_perte
      ),
      badgeClass: constructWidgetDetails(
        "badgeClass",
        devisCountPeriod?.pourcentage_gain_perte
      ),
      percentage: devisCountPeriod?.pourcentage_gain_perte || 0,
      counter: devisCountPeriod?.nb_devis_annee_courante || 0,
      bgcolor: "primary",
      icon: "bx bx-shopping-bag",
      decimals: 0,
      prefix: "",
      suffix: "",
      separator: " ",
    },
    {
      id: 3,
      cardColor: "success",
      label: "Factures",
      badge: constructWidgetDetails(
        "badge",
        invoiceCountPeriod?.pourcentage_gain_perte
      ),
      badgeClass: constructWidgetDetails(
        "badgeClass",
        invoiceCountPeriod?.pourcentage_gain_perte
      ),
      percentage: invoiceCountPeriod?.pourcentage_gain_perte || 0,
      counter: invoiceCountPeriod?.nb_invoice_annee_courante || 0,
      bgcolor: "primary",
      icon: "bx bx-user-circle",
      decimals: 0,
      prefix: "",
      suffix: "",
    },
    {
      id: 4,
      cardColor: "info",
      label: "Fournisseurs",
      badge: constructWidgetDetails(
        "badge",
        entityCountPeriod?.pourcentage_gain_perte
      ),
      badgeClass: constructWidgetDetails(
        "badgeClass",
        entityCountPeriod?.pourcentage_gain_perte
      ),
      percentage: entityCountPeriod?.pourcentage_gain_perte || 0,
      counter: entityCountPeriod?.nb_entity_annee_courante || 0,
      bgcolor: "primary",
      icon: "bx bx-wallet",
      decimals: 0,
    },
  ];
  return (
    <React.Fragment>
      {ecomWidgets.map((item, key) => (
        <Col xl={3} md={6} key={key}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                    {item.label}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <h5 className={"fs-14 mb-0 text-" + item.badgeClass}>
                    {item.badge ? (
                      <i className={"fs-13 align-middle " + item.badge}></i>
                    ) : null}{" "}
                    {item.percentage} %
                  </h5>
                </div>
              </div>
              <div className="d-flex align-items-end justify-content-between mt-4">
                <div>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                    <span className="counter-value" data-target="559.25">
                      <CountUp
                        start={0}
                        prefix={item.prefix}
                        suffix={item.suffix}
                        separator={item.separator}
                        end={item.counter}
                        decimals={item.decimals}
                        duration={1}
                      />
                    </span>
                  </h4>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </React.Fragment>
  );
};

export default Widgets;
