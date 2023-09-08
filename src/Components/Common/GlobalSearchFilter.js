import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  Input,
} from "reactstrap";
import { Link } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { French } from "flatpickr/dist/l10n/fr.js"
import { allstatus } from '../../common/data/invoiceList';
import { allstatusDevis } from '../../common/data/devisList';

const ProductsGlobalFilter = () => {
  return (
    <React.Fragment>
      <div className="col-sm-auto ms-auto">
        <div>
          <Link
            to="/apps-ecommerce-add-product"
            className="btn btn-success"
          >
            <i className="ri-add-line align-bottom me-1"></i> Add
            Product
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
};
const CustomersGlobalFilter = () => {
  const [customerStatus, setcustomerStatus] = useState(null);

  function handlecustomerStatus(customerStatus) {
    setcustomerStatus(customerStatus);
  }

  const customerstatus = [
    {
      options: [
        { label: "Status", value: "Status" },
        { label: "All", value: "All" },
        { label: "Active", value: "Active" },
        { label: "Block", value: "Block" },
      ],
    },
  ];

  return (
    <React.Fragment>
      <Col xl={7}>
        <Row className="g-3">
          <Col sm={4}>
            <div className="">
              <Flatpickr
                className="form-control"
                id="datepicker-publish-input"
                placeholder="Select a date"
                options={{
                  altInput: true,
                  altFormat: "F j, Y",
                  mode: "multiple",
                  dateFormat: "d.m.y",
                }}
              />
            </div>
          </Col>

          <Col sm={4}>
            <div>
              <Select
                value={customerStatus}
                onChange={() => {
                  handlecustomerStatus();
                }}
                options={customerstatus}
                name="choices-single-default"
                id="idStatus"
              ></Select>
            </div>
          </Col>

          <Col sm={4}>
            <div>
              <button
                type="button"
                className="btn btn-primary w-100"
              >
                {" "}
                <i className="ri-equalizer-fill me-2 align-bottom"></i>
                Filters
              </button>
            </div>
          </Col>
        </Row>
      </Col>
    </React.Fragment>
  );
};

const OrderGlobalFilter = () => {
  const [orderStatus, setorderStatus] = useState([]);
  const [orderPayement, setorderPayement] = useState(null);

  function handleorderStatus(orderstatus) {
    setorderStatus(orderstatus);
  }

  function handleorderPayement(orderPayement) {
    setorderPayement(orderPayement);
  }

  const orderstatus = [
    {
      options: [
        { label: "Status", value: "Status" },
        { label: "All", value: "All" },
        { label: "Pending", value: "Pending" },
        { label: "Inprogress", value: "Inprogress" },
        { label: "Cancelled", value: "Cancelled" },
        { label: "Pickups", value: "Pickups" },
        { label: "Returns", value: "Returns" },
        { label: "Delivered", value: "Delivered" },
      ],
    },
  ];

  const orderpayement = [
    {
      options: [
        { label: "Select Payment", value: "Select Payment" },
        { label: "All", value: "All" },
        { label: "Mastercard", value: "Mastercard" },
        { label: "Paypal", value: "Paypal" },
        { label: "Visa", value: "Visa" },
        { label: "COD", value: "COD" },
      ],
    },
  ];
  return (
    <React.Fragment>
      <Col sm={6} className="col-xxl-2">
        <div>
          <Flatpickr
            className="form-control"
            id="datepicker-publish-input"
            placeholder="Select a date"
            options={{
              altInput: true,
              altFormat: "F j, Y",
              mode: "multiple",
              dateFormat: "d.m.y",
            }}
          />
        </div>
      </Col>

      <Col sm={4} className="col-xxl-2">
        <div>
          <Select
            value={orderStatus}
            onChange={(e) => {
              handleorderStatus(e);
            }}
            options={orderstatus}
            name="choices-single-default"
            id="idStatus"
          ></Select>
        </div>
      </Col>

      <Col sm={4} className="col-xxl-2">
        <div>
          <Select
            value={orderPayement}
            onChange={() => {
              handleorderPayement();
            }}
            options={orderpayement}
            name="choices-payment-default"
            id="idPayment"
          ></Select>
        </div>
      </Col>

      <Col sm={4} className="col-xxl-1">
        <div>
          <button type="button" className="btn btn-primary w-100">
            {" "}
            <i className="ri-equalizer-fill me-1 align-bottom"></i>
            Filters
          </button>
        </div>
      </Col>
    </React.Fragment>
  );
};

const ContactsGlobalFilter = () => {
  const [sortBy, setsortBy] = useState(null);

  function handlesortBy(sortBy) {
    setsortBy(sortBy);
  }

  const sortbyname = [
    {
      options: [
        { label: "Owner", value: "Owner" },
        { label: "Company", value: "Company" },
        { label: "Location", value: "Location" }
      ],
    },
  ];
  return (
    <React.Fragment>
      <div className="col-md-auto ms-auto">
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted">Sort by: </span>
          <Select
            className="mb-0"
            value={sortBy}
            onChange={() => {
              handlesortBy();
            }}
            options={sortbyname}
            id="choices-single-default"
          >
          </Select>
        </div>
      </div>
    </React.Fragment>
  );
};

const CompaniesGlobalFilter = () => {
  const [sortBy, setsortBy] = useState("Owner");

  function handlesortBy(sortBy) {
    setsortBy(sortBy);
  }

  const sortbyname = [
    {
      options: [
        { label: "Owner", value: "Owner" },
        { label: "Company", value: "Company" },
        { label: "Location", value: "Location" },
      ],
    },
  ];
  return (
    <React.Fragment>
      <div className="col-md-auto ms-auto">
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted">Sort by: </span>
          <Select
            className="mb-0"
            value={sortBy}
            onChange={() => {
              handlesortBy();
            }}
            options={sortbyname}
            id="choices-single-default"
          ></Select>
        </div>
      </div>
    </React.Fragment>
  );
};

const CryptoOrdersGlobalFilter = () => {
  return (
    <React.Fragment>
      <Col xl={2} md={6}>
        <div className="input-group">
          <span className="input-group-text" id="basic-addon1"><i className="ri-calendar-2-line"></i></span>
          <Flatpickr
            placeholder="Select date"
            className="form-control"
            options={{
              mode: "range",
              dateFormat: "d M, Y"
            }}
          />
        </div>
      </Col>
      <Col xl={2} md={4}>
        <select className="form-control" data-choices data-choices-search-false name="choices-single-default"
          id="choices-single-default">
          <option defaultValue="">Select Type</option>
          <option value="Buy">Sell</option>
          <option value="Sell">Buy</option>
        </select>
      </Col>
      <Col xl={2} md={4}>
        <select className="form-control" data-choices data-choices-search-false name="choices-single-default2"
          id="choices-single-default2">
          <option defaultValue="">Select Status</option>
          <option value="Successful">Successful</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </Col>
      <Col xl={1} md={4}>
        <button className="btn btn-success w-100">Filters</button>
      </Col>
    </React.Fragment>
  );
};

const InvoiceListGlobalSearch = ({ origneData, data, setData, value }) => {
  const [isEtat, setisEtat] = useState(null);
  const [isText, setisText] = useState(null);
  const [isDate, setisDate] = useState(null);

  /**
   * Fonction de trier des factures
   */
  const filteredData = () => {
  
    let newData = [...origneData];

    if (isText) {
      newData = newData.filter((e) => e.contact.fco_cus_email.toLowerCase().includes(isText) || e.contact.fco_cus_name.toLowerCase().includes(isText) || e.header.fen_sujet.toLowerCase().includes(isText) || e.header.fen_total_ttc.toString().includes(isText))
    }

    if (isDate) {
      newData = newData.filter((e) => isDate.includes(e.header.fen_date_create))
    }

    if (isEtat) {
      newData = newData.filter((e) => e.header.fen_etat.toLowerCase() == isEtat.toLowerCase())
    }

    setData(() => newData);
  }

  useEffect(() => {
    if (origneData.length) {
      if (isEtat || isText || isDate) {
        filteredData();
      } else {
        setData(origneData)
      }
    }
  }, [isText, isDate, isEtat])

  return (
    <React.Fragment>
      <Row>

        <Col sm={4} xxl={5} >
          <div className={"search-box me-2 mb-2 d-flex col-12"}>
            <input
              onChange={(e) => {
                setisText(e.target.value != "" ? e.target.value : null)
              }}
              id="search-bar-0"
              type="text"
              className="form-control search /"
              placeholder={`Recherche...`}
              value={isText || ""}
            />
            <i className="bx bx-search-alt search-icon"></i>
          </div>
        </Col>

        <Col sm={4} xxl={3} className=' mb-2'>
          <Flatpickr
            onChange={(date, dateStr) => {
              setisDate(dateStr ? dateStr.split(', ') : null);
            }}
            className="form-control bg-light border-light"
            id="invoice-date-picker"
            placeholder="Selectionnez une date"
            options={{
              locale: French,
              altInput: true,
              enableTime: false,
              altFormat: "F j, Y",
              mode: "multiple",
              dateFormat: "Y-m-d",
            }}

          />
        </Col>

        <Col sm={4} xxl={3}>
          <div className="input-light">
            <Input
              type='select'
              onChange={(e) => {
                setisEtat(e.target.value)
              }}
              // options={allstatus}
              name="choices-single-default"
              id="idStatus"
            >
              {allstatus?.map((e, i) => (<option key={i} value={e.value}>{e.label}</option>))}
            </Input>
          </div>
        </Col>


      </Row>


      {/* <Col sm={4} xxl={1}>
        <Button color="primary" className="w-100">
          <i className="ri-equalizer-fill me-1 align-bottom"></i>{" "}
          Filters
        </Button>
      </Col> */}

    </React.Fragment>
  );
};

const DevisListGlobalSearch = ({ origneData, data, setData, value }) => {
  const [isEtat, setisEtat] = useState(null);
  const [isText, setisText] = useState(null);
  const [isDate, setisDate] = useState(null);

  /**
   * Fonction de trier des devis
   */
  const filteredData = () => {
  
    let newData = [...origneData];

    if (isText) {
      newData = newData.filter((e) => e.contact.dco_cus_email.toLowerCase().includes(isText) || e.contact.dco_cus_name.toLowerCase().includes(isText) || e.header.den_sujet.toLowerCase().includes(isText) || e.header.den_total_ttc.toString().includes(isText))
    }

    if (isDate) {
      newData = newData.filter((e) => isDate.includes(e.header.den_date_create))
    }

    if (isEtat) {
      newData = newData.filter((e) => e.header.den_etat.toLowerCase() == isEtat.toLowerCase())
    }

    setData(() => newData);
  }

  useEffect(() => {
    if (origneData.length) {
      if (isEtat || isText || isDate) {
        filteredData();
      } else {
        setData(origneData)
      }
    }
  }, [isText, isDate, isEtat])

  return (
    <React.Fragment>
      <Row>

        <Col sm={4} xxl={5} >
          <div className={"search-box me-2 mb-2 d-flex col-12"}>
            <input
              onChange={(e) => {
                setisText(e.target.value != "" ? e.target.value : null)
              }}
              id="search-bar-0"
              type="text"
              className="form-control search /"
              placeholder={`Recherche...`}
              value={isText || ""}
            />
            <i className="bx bx-search-alt search-icon"></i>
          </div>
        </Col>

        <Col sm={4} xxl={3} className=' mb-2'>
          <Flatpickr
            onChange={(date, dateStr) => {
              setisDate(dateStr ? dateStr.split(', ') : null);
            }}
            className="form-control bg-light border-light"
            id="invoice-date-picker"
            placeholder="Selectionnez une date"
            options={{
              locale: French,
              altInput: true,
              enableTime: false,
              altFormat: "F j, Y",
              mode: "multiple",
              dateFormat: "Y-m-d",
            }}

          />
        </Col>

        <Col sm={4} xxl={3}>
          <div className="input-light">
            <Input
              type='select'
              onChange={(e) => {
                setisEtat(e.target.value)
              }}
              // options={allstatus}
              name="choices-single-default"
              id="idStatus"
            >
              {allstatusDevis?.map((e, i) => (<option key={i} value={e.value}>{e.label}</option>))}
            </Input>
          </div>
        </Col>


      </Row>

    </React.Fragment>
  );
};

const TransactionListGlobalSearch = ({ origneData, data, setData, value }) => {
  const [isText, setisText] = useState(null);
  const [isDate, setisDate] = useState(null);

  /**
   * Fonction de trier des devis
   */
  const filteredData = () => {
  
    let newData = [...origneData];

    if (isText) {
      newData = newData.filter((e) => e.contact.dco_cus_email.toLowerCase().includes(isText) || e.contact.dco_cus_name.toLowerCase().includes(isText) || e.header.den_sujet.toLowerCase().includes(isText) || e.header.den_total_ttc.toString().includes(isText))
    }

    if (isDate) {
      newData = newData.filter((e) => isDate.includes(e.header.den_date_create))
    }

    setData(() => newData);
  }

  useEffect(() => {
    if (origneData.length) {
      if ( isText || isDate) {
        filteredData();
      } else {
        setData(origneData)
      }
    }
  }, [isText, isDate])

  return (
    <React.Fragment>
      <Row>

        <Col sm={4} xxl={5} >
          <div className={"search-box me-2 mb-2 d-flex col-12"}>
            <input
              onChange={(e) => {
                setisText(e.target.value != "" ? e.target.value : null)
              }}
              id="search-bar-0"
              type="text"
              className="form-control search /"
              placeholder={`Recherche...`}
              value={isText || ""}
            />
            <i className="bx bx-search-alt search-icon"></i>
          </div>
        </Col>

        <Col sm={4} xxl={3} className=' mb-2'>
          <Flatpickr
            onChange={(date, dateStr) => {
              setisDate(dateStr ? dateStr.split(', ') : null);
            }}
            className="form-control bg-light border-light"
            id="invoice-date-picker"
            placeholder="Selectionnez une date"
            options={{
              locale: French,
              altInput: true,
              enableTime: false,
              altFormat: "F j, Y",
              mode: "multiple",
              dateFormat: "Y-m-d",
            }}

          />
        </Col>
      </Row>

    </React.Fragment>
  );
};

const TicketsListGlobalFilter = () => {
  return (
    <React.Fragment>
      <Col xxl={3} sm={4}>
        <Flatpickr
          className="form-control"
          placeholder="Select date range"
          options={{
            mode: "range",
            dateFormat: "d M, Y"
          }}
        />
      </Col>
      <Col xxl={3} sm={4}>
        <div className="input-light">
          <select className="form-control" data-choices data-choices-search-false name="choices-single-default" id="idStatus">
            <option value="">Status</option>
            <option defaultValue="all">All</option>
            <option value="Open">Open</option>
            <option value="Inprogress">Inprogress</option>
            <option value="Closed">Closed</option>
            <option value="New">New</option>
          </select>
        </div>
      </Col>
      <Col xxl={1} sm={4}>
        <button type="button" className="btn btn-primary w-100"> <i className="ri-equalizer-fill me-1 align-bottom"></i>
          Filters
        </button>
      </Col>
    </React.Fragment>
  );
};

const NFTRankingGlobalFilter = () => {
  return (
    <React.Fragment>
      <Col xxl={2} sm={4} className="ms-auto">
        <div>
          <select className="form-control" data-choices data-choices-search-false name="choices-single-default" id="idStatus">
            <option value="All Time" defaultValue>All Time</option>
            <option value="1 Day">1 Day</option>
            <option value="7 Days">7 Days</option>
            <option value="15 Days">15 Days</option>
            <option value="1 Month">1 Month</option>
            <option value="6 Month">6 Month</option>
          </select>
        </div>
      </Col>
    </React.Fragment>
  );
};

const TaskListGlobalFilter = () => {
  return (
    <React.Fragment>
      <div className="col-xxl-3 col-sm-4">
        <Flatpickr
          placeholder="Select date range"
          className="form-control bg-light border-light"
          options={{
            mode: "range",
            dateFormat: "d M, Y"
          }}
        />
      </div>

      <div className="col-xxl-3 col-sm-4">
        <div className="input-light">
          <select className="form-control" data-choices data-choices-search-false name="status" id="idStatus">
            <option value="">Status</option>
            <option defaultValue="all"  >All</option>
            <option value="New">New</option>
            <option value="Pending">Pending</option>
            <option value="Inprogress">Inprogress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
      <div className="col-xxl-1 col-sm-4">
        <button type="button" className="btn btn-primary w-100"> <i className="ri-equalizer-fill me-1 align-bottom"></i>
          Filters
        </button>
      </div>
    </React.Fragment>
  );
};


export {
  
  CustomersGlobalFilter,
  
  InvoiceListGlobalSearch,
  DevisListGlobalSearch,
  TransactionListGlobalSearch
};