import React, { useEffect, useId, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useDispatch } from "react-redux";
import Section from "../DashboardMain/Section";
import moment from 'moment';
import Flatpickr from "react-flatpickr";
import {
  dowloadExport as onDowloadExport
} from '../../slices/thunks'
import { api } from "../../config";
import axios from "axios";


moment.locale('fr')

const Export = () => {
  document.title = "Accueil | Countano";
  const id = useId();
  const dispatch = useDispatch();
  const [periodeCalendar, setPeriodeCalendar] = useState({
    start: moment().format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD')
  })

  const download = async () => {
    axios.get(`${api.API_URL}/v1/export?date_start=${periodeCalendar.start}&date_end=${periodeCalendar.end}`, {
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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Export" pageTitle="Countano" />
          <Row>
            <Col xl={9}></Col>
            <Col xl={3}>
              <div className="h-100">
                <div className="mt-3 mt-lg-0">
                  <form action="#">
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
                          console.log(periodDate)
                          if (periodDate.length == 2) {
                            setPeriodeCalendar({
                              start: moment(periodDate[0]).format("YYYY-MM-DD"),
                              end: moment(periodDate[1]).format("YYYY-MM-DD"),
                            })
                          } else if (periodDate.length == 1) {
                            setPeriodeCalendar({
                              start: moment(periodDate[0]).format("YYYY-MM-DD"),
                              end: moment(periodDate[0]).format("YYYY-MM-DD"),
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
                    <button onClick={(e) => { e.preventDefault(); download(); }} className="mt-2 btn btn-primary">Télécharger les exports</button>
                  </form>
                </div>
                <Row>
                  <Col>

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

export default Export;
