import React, { useState } from 'react';
import { Col, Row } from 'reactstrap';
import Flatpickr from "react-flatpickr";
import moment from 'moment';
import { useProfile } from '../../Components/Hooks/UserHooks';

moment.locale('fr')

const Section = ({perdiodeCalendar,setPeriodeCalendar}) => {
    const { userProfile } = useProfile();


    return (
        <React.Fragment>
            <Row className="mb-3 pb-1">
                <Col xs={12}>
                    <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                        <div className="flex-grow-1">
                            <h4 className="fs-16 mb-1">Bonjour {userProfile.ent_name} !</h4>
                        </div>
                        <div className="mt-3 mt-lg-0">
                            <form action="#">
                                <Row className="g-3 mb-0 align-items-center">
                                    <div className="col-sm-auto">
                                        <div className="input-group">
                                            <Flatpickr
                                                className="form-control border-0 fs-13 dash-filter-picker shadow"
                                                options={{
                                                    locale:'fr',
                                                    mode: "range",
                                                    dateFormat: "d M, Y",
                                                    defaultDate: [perdiodeCalendar?.start,perdiodeCalendar?.end]
                                                }}
                                                onChange={(periodDate)=>{
                                                    // console.log(periodDate)

                                                    if(periodDate.length==2){
                                                        setPeriodeCalendar({
                                                            start: moment(periodDate[0]).format("YYYY-MM-DD"),
                                                            end: moment(periodDate[1]).format("YYYY-MM-DD"),
                                                        })
                                                    }else if(periodDate.length==1){
                                                        setPeriodeCalendar({
                                                            start: moment(periodDate[0]).format("YYYY-MM-DD"),
                                                            end: moment(periodDate[0]).format("YYYY-MM-DD"),
                                                        })
                                                    }else{
                                                        setPeriodeCalendar({
                                                            start: null,
                                                            end:null,
                                                        })
                                                    }
                                                }}
                                            />
                                            <div className="input-group-text bg-secondary border-secondary text-white"><i className="ri-calendar-2-line"></i></div>
                                        </div>
                                    </div>
                                    {/* <div className="col-auto">
                                        <button type="button" className="btn btn-soft-success"><i className="ri-add-circle-line align-middle me-1"></i> Add Product</button>
                                    </div>
                                    <div className="col-auto">
                                        <button type="button" className="btn btn-soft-info btn-icon waves-effect waves-light layout-rightside-btn" onClick={props.rightClickBtn} ><i className="ri-pulse-line"></i></button>
                                    </div> */}
                                </Row>
                            </form>
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Section;