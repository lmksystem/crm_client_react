import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import Widget from "./Widgets";
import Revenue from "./Revenue";
import {
  getDevisPeriodCount as onGetDevisPeriodCount,
  getTransactionPricePeriode as onGetTransactionPricePeriode,
  getInvoicePeriodCount as onGetInvoicePeriodCount,
  getEntityPeriodCount as onGetEntityPeriodCount,
  getTransactionByMonth as onGetTransactionByMonth,
} from "../../slices/thunks";
import { useDispatch } from "react-redux";
import Section from "./Section";
import moment from 'moment';
moment.locale('fr')

const DashboardMain = () => {
  document.title = "Accueil | Countano";

  const [rightColumn, setRightColumn] = useState(true);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };
  const dispatch = useDispatch();

  
  const dateActuelle = moment(); // Obtenez la date actuelle
  const dateNow = dateActuelle.format('DD MMM YYYY')
  const premiereDateAnnee = dateActuelle.startOf('year'); // Obtenez la première date de l'année
  
  const formattedDate = premiereDateAnnee.format('DD MMM YYYY'); // Formatez la date
  console.log("envoi ca",dateNow)
  const [perdiodeCalendar,setPeriodeCalendar] = useState({
      start:formattedDate.replace(/\./g, ','),
      end:dateNow,
  })

  useEffect(() => {
    dispatch(
      onGetTransactionPricePeriode({
        dateDebut: perdiodeCalendar.start
          ? moment(perdiodeCalendar.start).format("YYYY-MM-DD")
          : null,
        dateFin: perdiodeCalendar.end
          ? moment(perdiodeCalendar.end).format("YYYY-MM-DD")
          : null,
      })
    );
    dispatch(
      onGetDevisPeriodCount({
        dateDebut: perdiodeCalendar.start
          ? moment(perdiodeCalendar.start).format("YYYY-MM-DD")
          : null,
        dateFin: perdiodeCalendar.end
          ? moment(perdiodeCalendar.end).format("YYYY-MM-DD")
          : null,
      })
    );
    dispatch(
      onGetInvoicePeriodCount({
        dateDebut: perdiodeCalendar.start
          ? moment(perdiodeCalendar.start).format("YYYY-MM-DD")
          : null,
        dateFin: perdiodeCalendar.end
          ? moment(perdiodeCalendar.end).format("YYYY-MM-DD")
          : null,
      })
    );
    dispatch(
      onGetEntityPeriodCount({
        dateDebut: perdiodeCalendar.start
          ? moment(perdiodeCalendar.start).format("YYYY-MM-DD")
          : null,
        dateFin: perdiodeCalendar.end
          ? moment(perdiodeCalendar.end).format("YYYY-MM-DD")
          : null,
      })
    );
    dispatch(onGetTransactionByMonth({
      year:perdiodeCalendar?.start!=null?moment(perdiodeCalendar.start).year():moment().year()
    }));
    console.log(perdiodeCalendar);
  }, [perdiodeCalendar]);


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Tableau de bord" pageTitle="Coutano" />
          <Row>
            <Col>
              <div className="h-100">
                <Section perdiodeCalendar={perdiodeCalendar}  setPeriodeCalendar={setPeriodeCalendar}/>
                <Row>
                  <Widget perdiodeCalendar={perdiodeCalendar}/>
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
