import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import * as moment from "moment";

import {
  Col,
  Container,
  Row,
  Card,
  CardBody,
  Label,
  Input,
  Form,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";

//Import actions
import {
  getTransactionBank as onGetTransactionBank,
  getAchat as onGetAchat,
} from "../../slices/thunks";
//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../Components/Common/TableContainer";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import Loader from "../../Components/Common/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SimpleBar from "simplebar-react";

const TransactionBank = () => {
  const dispatch = useDispatch();
  const { isTransactionBankSuccess, error, transactions, achats } = useSelector(
    (state) => ({
      isTransactionBankSuccess: state.TransactionBank.isTransactionBankSuccess,
      transactions: state.TransactionBank.transactionsBank,
      error: state.Employee.error,
      achats: state.Achat.achats,
    })
  );
  const dateActuelle = moment(); // Obtenir la date actuelle
  const dateNow = dateActuelle.format("DD MMM YYYY");
  const premiereDateAnnee = dateActuelle.startOf("year"); // Obtenir la première date de l'année
  const formattedDate = premiereDateAnnee.format("DD MMM YYYY"); // Formatage de la date
  const [perdiodeCalendar, setPeriodeCalendar] = useState({
    start: formattedDate.replace(/\./g, ","),
    end: dateNow,
  });

  const [transaction, setTransaction] = useState({});

  const [show, setShow] = useState(false);

  const toggle = useCallback(() => {
    if (show) {
      setShow(false);
      setTransaction({});
    } else {
      setShow(true);
    }
  }, [show]);

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      //   lastname: (employee && employee.lastname) || "",
      //   firstname: (employee && employee.firstname) || "",
      //   email: (employee && employee.email) || "",
      //   date_entree: (employee && employee.date_entree) || "",
      nojustify:
        (transaction && transaction.tba_justify && transaction.tba_justify === 0
          ? true
          : false) || false,
      file_justify: (transaction && transaction.ado_file_name) || "",
    },
    // validationSchema: Yup.object({
    //   lastname: Yup.string().required("Veuillez entrer un nom"),
    //   firstname: Yup.string().required("Veuillez entrer un prénom"),
    //   email: Yup.string().required("Veuillez entrer un email"),
    //   date_entree: Yup.date().required("Veuillez entrer une date d'entrée"),
    // }),
    onSubmit: (values) => {
      //   if (isEdit) {
      //     const updateEmployee = {
      //       use_id: employee.id ? employee.id : 0,
      //       use_lastname: values.lastname,
      //       use_firstname: values.firstname,
      //       use_email: values.email,
      //       usa_date_entree: values?.date_entree || null,
      //       use_password: "none",
      //     };
      //     // update Employee
      //     dispatch(onCreateUpdateEmployee(updateEmployee));
      //     validation.resetForm();
      //   } else {
      //     const newEmployee = {
      //       use_lastname: values["lastname"],
      //       use_firstname: values["firstname"],
      //       use_email: values["email"],
      //       use_password: "none",
      //       use_rank: 1,
      //       usa_date_entree: values?.date_entree || null,
      //     };
      //     // console.log(newEmployee)
      //     // save new Contact
      //     dispatch(onCreateUpdateEmployee(newEmployee));
      //     validation.resetForm();
      //   }
    },
  });

  // Column
  const columns = useMemo(
    () => [
      {
        Header: "",
        accessor: "tba_id",
        hiddenColumns: true,
        Cell: (cell) => {
          return <input type="hidden" value={cell.value} />;
        },
      },
      {
        Header: "Date",
        accessor: "tba_bkg_date",
        filterable: false,
      },
      {
        Header: "Description",
        accessor: "tba_desc",
        filterable: false,
      },
      {
        Header: "Débit",
        accessor: "tba_debit",
        filterable: false,
        Cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
              <p className="p-0 m-0">
                {cell.value != null ? cell.value + "€" : ""}
              </p>
            </div>
          );
        },
      },
      {
        Header: "Crédit",
        accessor: "tba_credit",
        filterable: false,
        Cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
              <p className="p-0 m-0">
                {cell.value != null ? cell.value + "€" : ""}
              </p>
            </div>
          );
        },
      },
      {
        Header: "Reste à pointer",
        accessor: "tba_rp",
        filterable: false,
        Cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
              <p className="p-0 m-0">
                {cell.value != null ? cell.value + "€" : ""}
              </p>
            </div>
          );
        },
      },
     
      {
        Header: "Association",
        // accessor: "tba_assoc",
        filterable: false,

        Cell: (cell) => {
          let styleCSS = {};
          if(cell.row.original.tba_rp==0){
            styleCSS = {
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: 'green',
            };
          }else if(cell.row.original.tba_rp == Math.abs(parseFloat(cell.row.original.tba_amount))){
            styleCSS = {
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: '2px solid red',
              backgroundColor: 'transparent',
              alignItems:"center",
              justifyContent:'center',
              display:'flex'
            };
          }else if(cell.row.original.tba_rp < Math.abs(parseFloat(cell.row.original.tba_amount)) && cell.row.original.tba_rp>0){
            styleCSS = {
              width: '10px',
              height: '20px',
              borderBottomRightRadius: '10px',
              borderTopRightRadius: '10px',
              backgroundColor: 'orange',
              marginLeft:8
            };
          }
          return (
            <div className="d-flex align-items-center">
              <div style={styleCSS}>
              {cell.row.original.tba_rp == Math.abs(parseFloat(cell.row.original.tba_amount)) &&
             <i style={{color:'red'}} className="las la-times" ></i>
              }
              </div>
            </div>
          );
        },
      },
    ],
    [transaction]
  );

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        document.getElementById("start-anime").classList.add("show");
      }, 400);
    } else {
      document.getElementById("start-anime").classList.remove("show");
    }
  }, [show]);

  useEffect(() => {
    dispatch(
      onGetTransactionBank({
        dateDebut: perdiodeCalendar.start
          ? moment(perdiodeCalendar.start).format("YYYY-MM-DD")
          : null,
        dateFin: perdiodeCalendar.end
          ? moment(perdiodeCalendar.end).format("YYYY-MM-DD")
          : null,
      })
    );
  }, [dispatch, perdiodeCalendar]);

  useEffect(() => {
    dispatch(onGetAchat());
  }, [dispatch]);

  const [achatFilter,setAchatFilter] = useState({
    data:achats || [],
    searchTerm:'',
  })

  
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setAchatFilter({...achatFilter,searchTerm: value });
  };

  useEffect(() => {
    dispatch(onGetAchat());
  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(transactions)) {
      setTransaction({});
    }
  }, [transactions]);

  const setterDate = (value, showPartClose = false) => {
    setPeriodeCalendar(value);
    if (showPartClose) {
      setShow(false);
    }
  };

  const  filterData = () => {
    return achatFilter?.data?.filter((item) => {
      // Définissez ici les propriétés sur lesquelles vous souhaitez effectuer la recherche
      const searchFields = [item.ach_lib, item.ach_rp,item.ach_date_create];
      return searchFields.some((field) =>
        field?.toLowerCase()?.includes(achatFilter?.searchTerm?.toLowerCase())
      );
    });
  }
  const filteredData = filterData();
  const partiesDuChemin = validation?.values?.file_justify.split("\\"); // Divise le chemin en morceaux en fonction de "\"
  const nomDuFichier = partiesDuChemin[partiesDuChemin.length - 1];
  document.title = "Transactions bancaires | Countano";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Transactions bancaires"
            pageTitle="Banque / Achat"
          />
          <Row>
            <Col className="view-animate" xxl={show ? 7 : 12}>
              <Card id="contactList">
                <CardBody className="pt-0">
                  <div>
                    {isTransactionBankSuccess ? (
                      <TableContainer
                        columns={columns}
                        data={transactions || []}
                        perdiodeCalendar={perdiodeCalendar}
                        setPeriodeCalendar={setterDate}
                        actionItem={(row) => {
                          const transData = row.original;
                          setShow(true);
                          setTransaction({
                            id: transData.tba_id,
                            nojustify:
                              transData.tba_justify == 1 ? false : true,
                            file_justify: transData.ado_file_name,
                          });
                        }}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={8}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-3"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        isContactsFilter={true}
                        SearchPlaceholder="Recherche..."
                      />
                    ) : (
                      <Loader error={error} />
                    )}
                  </div>
                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>
            <Col xxl={show ? 5 : 0}>
              <div id="start-anime">
                <Card id="contact-view-detail">
                  <div onClick={toggle}>
                    <i className="las la-chevron-circle-left la-2x m-2"></i>
                  </div>

                  <CardBody className="text-center">
                    <h5 className=" mb-1">Détail transaction</h5>
                  </CardBody>
                  <CardBody>
                    <div className="table-responsive table-card">
                      <Form
                        className="tablelist-form"
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        <div className="p-3">
                          <Input type="hidden" id="id-field" />

                          {/* {transaction?.file_justify === null && ( */}
                            <Col lg={8} className="mt-3">
                              <div className="form-switch">
                                <Input
                                  name="nojustify"
                                  id="nojustify-field"
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  checked={transaction.nojustify || false}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                />
                                <Label
                                  htmlFor="nojustify-field"
                                  className="form-label mx-3"
                                >
                                  Pas de justificatif nécessaire
                                </Label>
                              </div>
                            </Col>
                          {/* )} */}

                          {/* {transaction?.file_justify !== null && (
                            <Row className="mt-3">
                              <Col lg={3}>
                                <p>{nomDuFichier}</p>
                              </Col>
                              <Col lg={3}>
                                <i className="lab la-readme la-lg mx-2"></i>
                                <i className="ri-delete-bin-fill text-muted la-lg  mx-2"></i>
                              </Col>
                            </Row>
                           )}  */}

                          {!transaction.nojustify &&
                            (
                              <Col lg={11} className="mt-4">
                                <div>
                                  <p className="text-muted">
                                    Associer la transaction à un/plusieurs achat(s)
                                  </p>
                                  <div id="users">
                                    <Row className="mb-2">
                                      <Col lg={7}>
                                        <div>
                                          <input
                                            className="search form-control"
                                            placeholder="Chercher un achat"
                                            value={achatFilter.searchTerm} onChange={handleSearchChange} 
                                          />
                                        </div>
                                      </Col>
                                      {/* <Col lg={1} className="my-auto ">
                                        <p className="text-align-center">ou</p>
                                      </Col>
                                      <Col lg={6} className="col-auto">
                                        <Input
                                          name="file_justify"
                                          id="file_justify-field"
                                          className="form-control"
                                          type="file"
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          value={
                                            transaction?.file_justify || ""
                                          }
                                          accept=".pdf"
                                        />
                                      </Col> */}
                                    </Row>

                                    <SimpleBar
                                      style={{ height: "242px" }}
                                      className="mx-n3"
                                    >
                                      <ListGroup className="list mb-0" flush>
                                        {filteredData?.map((ach) => {
                                          return (
                                            <ListGroupItem data-id="1">
                                              <div className="d-flex">
                                                <div className="flex-grow-1">
                                                  <h5 className="fs-13 mb-1">
                                                    <Link
                                                      to="#"
                                                      className="link name text-dark"
                                                    >
                                                      {ach.ach_lib}
                                                    </Link>
                                                  </h5>
                                                  <p
                                                    className="born timestamp text-muted mb-0"
                                                    data-timestamp="12345"
                                                  >
                                                    {ach.ach_date_create}
                                                  </p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                  <div>€ -{ach.ach_rp}</div>
                                                </div>
                                              </div>
                                            </ListGroupItem>
                                          );
                                        })}
                                      </ListGroup>
                                    </SimpleBar>
                                  </div>
                                </div>
                              </Col>
                            )}
                          {/* {validation.values.file_justify !== ""

                          &&

                        //   <div className="ratio ratio-16x9">
                        //                     <iframe className="rounded" src="https://www.youtube.com/embed/1y_kfWUCFDQ" title="YouTube video" allowFullScreen></iframe>
                        //                 </div>

                        //   */}
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TransactionBank;
