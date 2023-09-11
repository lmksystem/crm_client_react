import React,{useEffect, useState} from 'react';
import CountUp from "react-countup";
import { Link } from 'react-router-dom';
import { Card, CardBody, Col } from 'reactstrap';
import {
    getDevisPeriodCount  as onGetDevisPeriodCount,
    getTransactionPricePeriode as onGetTransactionPricePeriode
  } from "../../slices/thunks";
  import { useSelector, useDispatch } from "react-redux";
// import { ecomWidgets } from "../../common/data";
import moment from 'moment';
moment.locale('fr')


const Widgets = () => {

    const dispatch = useDispatch();
    const dateActuelle = moment(); // Obtenez la date actuelle
    const dateNow = dateActuelle.format('YYYY-MM-DD')
    const premiereDateAnnee = dateActuelle.startOf('year'); // Obtenez la première date de l'année
    const formattedDate = premiereDateAnnee.format('YYYY-MM-DD'); // Formatez la date
    const [perdiodeCalendar,setPeriodeCalendar] = useState({
        start:formattedDate.replace(/\./g, ','),
        end:dateNow,
    })
    const { transactionsPeriodPrice,devisCountPeriod,invoicesPeriodCount,fournisseursPeriodCount} = useSelector((state) => ({
        transactionsPeriodPrice: state.Transaction.transactionsPeriodPrice,
        devisCountPeriod: state.Devis.devisCountPeriod,
        invoicesPeriodCount: state.Transaction.invoicesPeriodCount,
        fournisseursPeriodCount:state.Transaction.fournisseursPeriodCount,
      }));
        useEffect(() => {
        dispatch(onGetTransactionPricePeriode({
            dateDebut:null,
            dateFin:null,
        }));
        dispatch(onGetDevisPeriodCount({
            dateDebut:'2023-08-09',
            dateFin:'2023-08-12',
        }));
      }, []);
      
      function constructWidgetDetails (label,value){
        if(label==="badge"){
            console.log(value);
            if(value>0){
                return "ri-arrow-right-up-line";
            }else if(value<0){
                return "ri-arrow-right-down-line"
            }else{
                return null
            }   
        }else if(label==="badgeClass"){
            if(value>0){
                return "success";
            }else if(value<0){
                return "danger"
            }else{
                return "muted"
            } 
        }
        return null
      }


    const ecomWidgets = [
        {
            id: 1,
            cardColor: "primary",
            label: "Total ventes",
            badge:constructWidgetDetails("badge",transactionsPeriodPrice?.pourcentage_gain_perte),
            badgeClass:constructWidgetDetails("badgeClass",transactionsPeriodPrice?.pourcentage_gain_perte),
            percentage:transactionsPeriodPrice?.pourcentage_gain_perte,
            counter:transactionsPeriodPrice?.ventes_courantes,
            bgcolor: "primary",
            icon: "bx bx-dollar-circle",
            decimals: 2,
            prefix: "",
            suffix: "€"
        },
        {
            id: 2,
            cardColor: "secondary",
            label: "Devis",
            badge: "ri-arrow-right-down-line",
            badgeClass: "danger",
            percentage: "-3.57",
            counter: devisCountPeriod.nb_devis,
            link: "View all orders",
            bgcolor: "primary",
            icon: "bx bx-shopping-bag",
            decimals: 0,
            prefix: "",
            suffix: "",
            separator:" ",
        },
        {
            id: 3,
            cardColor: "success",
            label: "Factures",
            badge: "ri-arrow-right-up-line",
            badgeClass: "success",
            percentage: "+29.08",
            counter: "183",
            link: "See details",
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
            badgeClass: "muted",
            badge:null,
            percentage: "+0.00",
            counter: "165",
            link: "Withdraw money",
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
                                    <p className="text-uppercase fw-medium text-muted text-truncate mb-0">{item.label}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <h5 className={"fs-14 mb-0 text-" + item.badgeClass}>
                                        {item.badge ? <i className={"fs-13 align-middle " + item.badge}></i> : null} {item.percentage} %
                                    </h5>
                                </div>
                            </div>
                            <div className="d-flex align-items-end justify-content-between mt-4">
                                <div>
                                    <h4 className="fs-22 fw-semibold ff-secondary mb-4"><span className="counter-value" data-target="559.25">
                                        <CountUp
                                            start={0}
                                            prefix={item.prefix}
                                            suffix={item.suffix}
                                            separator={item.separator}
                                            end={item.counter}
                                            decimals={item.decimals}
                                            duration={4}
                                        />
                                    </span></h4>
                                    {/* <Link to="#" className="text-decoration-underline text-muted">{item.link}</Link> */}
                                </div>
                                {/* <div className="avatar-sm flex-shrink-0">
                                    <span className={"avatar-title rounded fs-3 bg-soft-" + item.bgcolor}>
                                        <i className={`text-${item.bgcolor} ${item.icon}`}></i>
                                    </span>
                                </div> */}
                            </div>
                        </CardBody>
                    </Card>
                </Col>))}
        </React.Fragment>
    );
};

export default Widgets;