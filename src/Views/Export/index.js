import React, { useEffect, useId, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import Section from "../DashboardMain/Section";
import moment from 'moment';
import Flatpickr from "react-flatpickr";
import {
  getInvoices as onGetInvoices
} from '../../slices/thunks'
import { api } from "../../config";
import axios from "axios";
import InvoiceChart from "./InvoiceChart";

moment.updateLocale('en')

const Export = () => {
  document.title = "Accueil | Countano";

  const dispatch = useDispatch();

  const [selectedInvoice, setSelectedInvoice] = useState([]);
  const [dataChart, setDataChart] = useState([]);

  const [periodeCalendar, setPeriodeCalendar] = useState({
    start: new Date(moment().startOf('year')),
    end: new Date(moment().endOf('year'))
  })

  const { invoices } = useSelector((state) => ({
    invoices: state.Invoice.invoices,
  }));

  const download = async () => {
    console.log(periodeCalendar.end, moment(new Date(periodeCalendar.end)).format("DD MMM YYYY"));
    axios.get(`${api.API_URL}/v1/export?date_start=${moment(periodeCalendar.start).format('YYYY-MM-DD')}&date_end=${moment(periodeCalendar.end).format('YYYY-MM-DD')}`, {
      mode: 'no-cors',
      responseType: 'blob'
    }).then((response) => {
      try {
        let elm = document.createElement('a');  // CREATE A LINK ELEMENT IN DOM
        elm.href = URL.createObjectURL(response);  // SET LINK ELEMENTS CONTENTS
        elm.setAttribute('download', "export_comptable.zip"); // SET ELEMENT CREATED 'ATTRIBUTE' TO DOWNLOAD, FILENAME PARAM AUTOMATICALLY
        elm.click();                             // TRIGGER ELEMENT TO DOWNLOAD
        elm.remove();
      }
      catch (err) {
        console.log(err);
      }
    });

  }

  const getDateByMonth = () => {
    let data = new Array(12).fill(0);

    for (let index = 0; index < selectedInvoice.length; index++) {
      const invoice = selectedInvoice[index];
      let month = moment(invoice.header.fen_date_create).month();

      data[month] += invoice.header.fen_total_ttc
    }
    setDataChart(data)

  }

  useEffect(() => {
    dispatch(onGetInvoices());
  }, [dispatch]);

  useEffect(() => {
    setSelectedInvoice(invoices.filter((i) => (moment(i.header.fen_date_create).isBetween(moment(periodeCalendar.start).format('YYYY-MM-DD'), moment(periodeCalendar.end).format('YYYY-MM-DD')))));
  }, [invoices, periodeCalendar])

  useEffect(() => {
    getDateByMonth(selectedInvoice)
  }, [selectedInvoice])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Export" pageTitle="Countano" />
          <Row>
            <Col lg={12}>
              <form action="#" className="mb-2">

                <div className="h-100">
                  <div className="mt-3 mt-lg-0">
                    <Row>
                      <Col lg={6}>
                        <div className="input-group">
                          <Flatpickr
                            className="form-control border-0 fs-13 dash-filter-picker shadow"
                            options={{
                              locale: 'fr',
                              mode: "range",
                              dateFormat: "d M, Y",
                              defaultDate: [periodeCalendar?.start, periodeCalendar?.end]
                            }}
                            onChange={(periodDate) => {

                              if (periodDate.length == 2) {
                                setPeriodeCalendar({
                                  start: new Date(periodDate[0]),
                                  end: new Date(periodDate[1]),
                                })
                              } else if (periodDate.length == 1) {
                                setPeriodeCalendar({
                                  start: new Date(periodDate[0]),
                                  end: new Date(periodDate[0]),
                                })
                              } else {
                                setPeriodeCalendar({
                                  start: null,
                                  end: null,
                                })
                              }
                            }}
                          />
                          <div className="input-group-text bg-secondary border-secondary text-white"><i className="ri-calendar-2-line"></i></div>

                        </div>
                      </Col>
                      <Col lg={6}>
                        <button onClick={(e) => { e.preventDefault(); download(); }} className="btn btn-primary">Télécharger les exports</button>
                      </Col>
                    </Row>
                  </div>

                </div>

              </form>
            </Col>
            <Col lg={12}>
              <div className="bg-white">
                <InvoiceChart series={[
                  {
                    name: "Facture",
                    type: 'column',
                    data: dataChart
                  }
                ]}
                  periodeCalendar={periodeCalendar}
                  dataColors='[ "--vz-secondary","--vz-warning", "--vz-primary"]' />
              </div>

            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Export;
