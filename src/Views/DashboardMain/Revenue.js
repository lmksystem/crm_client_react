import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { RevenueCharts } from "./DashboardEcommerceCharts";
import CountUp from "react-countup";
import { useSelector } from "react-redux";
import moment from 'moment';
moment.locale('fr')


const Revenue = ({perdiodeCalendar}) => {
  const [chartData, setchartData] = useState([]);

  const {transactionByMonth,devisByMonth,invoiceByMonth} = useSelector(state => ({
    transactionByMonth:state.Transaction.transactionByMonth,
    devisByMonth:state.Devis.devisByMonth,
    invoiceByMonth:state.Invoice.invoiceByMonth,

  }));
  useEffect(() => {
    const tableauTransaction = transactionByMonth.map(objet => objet["somme_tra_value"]);
    const tableauDevis = devisByMonth.map(objet => objet["count_devis"]);
    const tableauInvoice = invoiceByMonth.map(objet => objet["count_invoice"]);
    const newArrayForGraph = [
      {
        name:"Devis",
        type:"area",
        data:tableauDevis
      },
      {
        name:"Ventes",
        type:"bar",
        data:tableauTransaction
      },
      {
        name:"Factures",
        type:"line",
        data:tableauInvoice
      },
    ]
    setchartData(newArrayForGraph);

  }, [perdiodeCalendar,transactionByMonth,devisByMonth,invoiceByMonth])
  

  return (
    <React.Fragment>
      <Card>
        <CardHeader className="border-0 align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Revenus - {perdiodeCalendar?.start!=null?moment(perdiodeCalendar.start).year():moment().year()}</h4>
          {/* <div className="d-flex gap-1">
            <button type="button" className="btn btn-soft-secondary btn-sm" onClick={() => { onChangeChartPeriod("all"); }}>
              ALL
            </button>
            <button type="button" className="btn btn-soft-secondary btn-sm" onClick={() => { onChangeChartPeriod("month"); }}>
              1M
            </button>
            <button type="button" className="btn btn-soft-secondary btn-sm" onClick={() => { onChangeChartPeriod("halfyear"); }}>
              6M
            </button>
            <button type="button" className="btn btn-soft-primary btn-sm" onClick={() => { onChangeChartPeriod("year"); }}>
              1Y
            </button>
          </div> */}
        </CardHeader> 

        <CardHeader className="p-0 border-0 bg-soft-light">
          <Row className="g-0 text-center">
            <Col xs={6} sm={4}>
              <div className="p-3 border border-dashed border-start-0">
                <h5 className="mb-1">
                  <CountUp start={0} end={devisByMonth?.length>0?devisByMonth.reduce((accumulateur, objet) => { return accumulateur + objet["count_devis"];}, 0):0 }  duration={1} separator=" " />
                </h5>
                <p className="text-muted mb-0">Devis</p>
              </div>
            </Col>
            <Col xs={6} sm={4}>
              <div className="p-3 border border-dashed border-start-0">
                <h5 className="mb-1">
                  <CountUp
                    suffix={"€"}
                    // prefix=""
                    start={0}
                    decimals={2}
                    end={transactionByMonth?.length>0?transactionByMonth.reduce((accumulateur, objet) => { return accumulateur + objet["somme_tra_value"];}, 0) :0 }
                    duration={1}
                    separator={" "}
                    decimal=","
                  />
                </h5>
                <p className="text-muted mb-0">Total des ventes</p>
              </div>
            </Col>
            <Col xs={6} sm={4}>
              <div className="p-3 border border-dashed border-start-0">
                <h5 className="mb-1">
                  <CountUp start={0} end={invoiceByMonth?.length>0?invoiceByMonth.reduce((accumulateur, objet) => { return accumulateur + objet["count_invoice"];}, 0):0 } duration={1} separator=" "  />
                </h5>
                <p className="text-muted mb-0">Factures</p>
              </div>
            </Col>
        
          </Row>
        </CardHeader>

        <CardBody className="p-0 pb-2">
          <div className="w-100">
            <div dir="ltr">
              <RevenueCharts series={chartData} dataColors='["--vz-warning", "--vz-primary", "--vz-success"]' />
            </div>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default Revenue;
