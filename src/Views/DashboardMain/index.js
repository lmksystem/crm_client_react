import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import Widget from "./Widgets";
import Revenue from "./Revenue";
import { getDevisPeriodCount as onGetDevisPeriodCount, getTransactionPricePeriode as onGetTransactionPricePeriode, getInvoicePeriodCount as onGetInvoicePeriodCount, getEntityPeriodCount as onGetEntityPeriodCount, getTransactionByMonth as onGetTransactionByMonth, getDevisByMonth as onGetDevisByMonth, getInvoiceByMonth as onGetInvoiceByMonth, getCompany as onGetCompany } from "../../slices/thunks";
import { useDispatch } from "react-redux";
import Section from "./Section";
import moment from "moment";
import { getLoggedinUser } from "../../helpers/api_helper";

moment.locale("fr");

const DashboardMain = () => {
  document.title = "Accueil | Countano";

  const dispatch = useDispatch();

  const [perdiodeCalendar, setPeriodeCalendar] = useState({
    start: moment().startOf("year"),
    end: moment()
  });

  const user = getLoggedinUser();
  let trialPeriodEnd = moment().diff(user.com_date_create, 'days');
  console.log(trialPeriodEnd);

  useEffect(() => {
    let dateDebut = perdiodeCalendar.start ? moment(perdiodeCalendar.start).format("YYYY-MM-DD") : null;
    let dateFin = perdiodeCalendar.end ? moment(perdiodeCalendar.end).format("YYYY-MM-DD") : null;
    let year = perdiodeCalendar?.start != null ? moment(perdiodeCalendar.start).year() : moment().year();

    dispatch(
      onGetTransactionPricePeriode({
        dateDebut: dateDebut,
        dateFin: dateFin
      })
    );
    dispatch(
      onGetDevisPeriodCount({
        dateDebut: dateDebut,
        dateFin: dateFin
      })
    );
    dispatch(
      onGetInvoicePeriodCount({
        dateDebut: dateDebut,
        dateFin: dateFin
      })
    );
    dispatch(
      onGetEntityPeriodCount({
        dateDebut: dateDebut,
        dateFin: dateFin
      })
    );
    dispatch(
      onGetTransactionByMonth({
        year: year
      })
    );
    dispatch(
      onGetDevisByMonth({
        year: year
      })
    );
    dispatch(
      onGetInvoiceByMonth({
        year: year
      })
    );
  }, [perdiodeCalendar]);

  useEffect(() => {
    dispatch(onGetCompany());
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Tableau de bord"
            pageTitle="Countano"
          />
          <Row>
            {trialPeriodEnd >= 13 && user.com_mod_fk == 2 && (
              <div className="alert alert-danger" style={{ marginTop: "-25px", marginBottom: "15px", borderRadius: 5 }}>
                <span>Votre période d'essai arrive à son terme si vous souhaitez connaitre les offerts disponibles pour continuer à utiliser Countano suivent ce lien. <a href="https://countano.com/tarifs/">Voir les offerts</a></span>
              </div>
            )}

            <Col>
              <div className="h-100">
                <Section
                  perdiodeCalendar={{ start: moment(perdiodeCalendar.start).format("DD MMM YYYY"), end: moment(perdiodeCalendar.end).format("DD MMM YYYY") }}
                  setPeriodeCalendar={setPeriodeCalendar}
                />
                <Row>
                  <Widget perdiodeCalendar={perdiodeCalendar} />
                </Row>
                <Row>
                  <Col>
                    <Revenue perdiodeCalendar={perdiodeCalendar} />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardMain;
