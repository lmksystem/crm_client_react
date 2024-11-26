import React, { useEffect, useState, useCallback, useMemo } from "react";

import { Col, Container, Row, Card, CardBody, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ListGroup, ListGroupItem } from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";

//Import actions
import { getEmployees as onGetEmployees, getSalary as onGetSalary, deleteSalary as onDeleteSalary } from "../../slices/thunks";
//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../Components/Common/TableContainer";

import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cleave from "cleave.js/react";
import moment from "moment";
import { customFormatNumber } from "../../utils/function";
import Formulaire from "./Formulaire";
import { SalaryService } from "../../services";

const Salary = () => {
  const dispatch = useDispatch();
  const { devise } = useSelector((state) => ({
    devise: state.Company.devise
  }));
  const yearActual = new Date().getFullYear().toString();

  const [salId, setSalId] = useState({}); //Objet salaire que l'ion sélectionne pour action
  const [dateFormat, setDateFormat] = useState(yearActual);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [modal, setModal] = useState(false);
  const [dateMonthChoice, setDateMonthChoice] = useState(null);
  // Créez un objet pour organiser les données par mois
  const [moisDonnees, setMoisDonnee] = useState({});
  const [refresh, setRefresh] = useState(false);

  function toggle(info) {
    setSalId(info.id ? info.id : undefined);
    setModal((res) => !res);
    setIsEdit(info.id ? true : false);
  }

  function toggleRefresh() {
    setRefresh((res) => !res);
  }

  // Delete Data
  const handleDeleteSalary = () => {
    if (salId) {
      SalaryService.deleteSalary(salId).then(() => {
        setDeleteModal(false);
        toggleRefresh();
      });
    }
  };

  const onClickDelete = (info) => {
    setSalId(info.id);
    setDeleteModal(true);
  };

  function onDateFormatChange(e) {
    setDateMonthChoice(null);
    setDateFormat(e.target.rawValue);
  }

  // Créez un objet de correspondance entre les noms des mois et leurs indices
  const moisIndices = {
    1: "Janvier",
    2: "Février",
    3: "Mars",
    4: "Avril",
    5: "Mai",
    6: "Juin",
    7: "Juillet",
    8: "Août",
    9: "Septembre",
    10: "Octobre",
    11: "Novembre",
    12: "Décembre"
  };

  const MoisComponent = () => {
    // Affichez tous les mois de l'année, même ceux sans données
    return (
      <div>
        {Object.keys(moisIndices).map((moisIndex) => {
          const moisNom = moisIndices[moisIndex];
          let classBySelectMonth = moisNom === dateMonthChoice ? "list-group-item list-group-item-action list-group-item-info" : `list-group-item list-group-item-action ${moisDonnees[moisNom]?.length > 0 ? " " : "disabled"}`;
          return (
            <button
              disabled={moisDonnees[moisNom]?.length <= 0 ? true : false}
              onClick={() => {
                setDateMonthChoice(moisNom);
              }}
              key={moisIndex}
              type="button"
              className={classBySelectMonth}>
              <p className={`p-0 m-0 ${moisDonnees[moisNom]?.length > 0 ? "fw-bolder" : ""}`}>{moisNom}</p>
            </button>
          );
        })}
      </div>
    );
  };

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".contactCheckBox");

    if (checkall.checked) {
      ele.forEach((ele) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

  const deleteMultiple = async () => {
    const checkall = document.getElementById("checkBoxAll");
    for (let index = 0; index < selectedCheckBoxDelete.length; index++) {
      const element = selectedCheckBoxDelete[index];
      await SalaryService.deleteSalary(element.value);
    }
    setIsMultiDeleteButton(false);
    checkall.checked = false;
    toggleRefresh();
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".contactCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  // Column
  const columns = useMemo(
    () => [
      {
        Header: (
          <input
            type="checkbox"
            id="checkBoxAll"
            className="form-check-input"
            onClick={() => checkedAll()}
          />
        ),
        Cell: (cellProps) => {
          return (
            <input
              type="checkbox"
              className="contactCheckBox form-check-input"
              value={cellProps.row.original.sal_id}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "#"
      },
      {
        Header: "",
        accessor: "sal_id",
        hiddenColumns: true,
        Cell: (cell) => {
          return (
            <input
              type="hidden"
              value={cell.row.original.sal_id}
            />
          );
        }
      },
      {
        Header: "Nom",
        accessor: "use_firstname",
        filterable: false
      },
      {
        Header: "Prénom",
        accessor: "use_lastname",
        filterable: false
      },
      {
        Header: "Net",
        accessor: "sal_net",
        filterable: false,
        Cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
              <div>
                {customFormatNumber(parseFloat(cell.value))}
                {devise}
              </div>
            </div>
          );
        }
      },
      {
        Header: "Brut",
        accessor: "sal_brut",
        filterable: false,
        Cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
              <div>
                {customFormatNumber(parseFloat(cell.value))}
                {devise}
              </div>
            </div>
          );
        }
      },
      {
        Header: "Brut chargé",
        accessor: "sal_bcharge",
        filterable: false,
        Cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
              <div>
                {customFormatNumber(parseFloat(cell.value))}
                {devise}
              </div>
            </div>
          );
        }
      },
      {
        Header: "Date versement",
        accessor: "sal_date",
        filterable: false,
        Cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
              <div>{moment(cell.value).isValid() ? moment(cell.value).format("D MMM YYYY") : "Aucune date"}</div>
            </div>
          );
        }
      },
      {
        Header: "Action",
        Cell: ({ row }) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item">
                <UncontrolledDropdown>
                  <DropdownToggle
                    href="#"
                    className="btn btn-soft-secondary btn-sm dropdown"
                    tag="button">
                    <i className="ri-more-fill align-middle"></i>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end">
                    <DropdownItem
                      className="dropdown-item edit-item-btn"
                      href="#"
                      onClick={() => {
                        toggle({ id: row.original.sal_id });
                      }}>
                      <i className="ri-pencil-fill align-bottom me-2 text-primary"></i> Modifier
                    </DropdownItem>
                    <DropdownItem
                      className="dropdown-item remove-item-btn"
                      href="#"
                      onClick={() => {
                        onClickDelete({ id: row.original.sal_id });
                      }}>
                      <i className="ri-delete-bin-fill align-bottom me-2 text-danger"></i> Supprimer
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </li>
            </ul>
          );
        }
      }
    ],
    [checkedAll, moisDonnees]
  );

  async function ChargeMoisDate() {
    const salaries = await SalaryService.getSalary(dateFormat);
    let moisData = {};
    for (let index = 0; index < salaries.length; index++) {
      const element = salaries[index];
      const moisNom = moisIndices[element?.mois];
      if (!moisData[moisNom]) {
        moisData[moisNom] = [];
      }
      moisData[moisNom].push(element);
    }
    setMoisDonnee(moisData);
  }

  useEffect(() => {
    if (dateFormat?.length > 3) {
      ChargeMoisDate();
    }
  }, [dateFormat, refresh]);

  document.title = "Salaires | Countano";
  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteSalary}
          onCloseClick={() => setDeleteModal(false)}
        />

        <DeleteModal
          show={deleteModalMulti}
          onDeleteClick={() => {
            deleteMultiple();
            setDeleteModalMulti(false);
          }}
          onCloseClick={() => setDeleteModalMulti(false)}
        />
        <Container fluid>
          <BreadCrumb
            title="Salaires"
            pageTitle="Employés"
          />
          <Row>
            <Col
              className="d-flex  justify-content-between"
              lg={12}>
              <div className="flex-grow-1">
                <button
                  className="btn btn-secondary add-btn"
                  onClick={() => {
                    setModal(true);
                  }}>
                  <i className="ri-add-fill me-1 align-bottom"></i> Ajouter un salaire
                </button>
              </div>
              <div className="d-flex justify-content-end align-items-center flex-wrap gap-5 mb-2">
                <div className="flex-shrink-0 mr-8">
                  <div className="hstack text-nowrap gap-2">
                    {isMultiDeleteButton && (
                      <button
                        className="btn btn-danger"
                        onClick={() => setDeleteModalMulti(true)}>
                        <i className="ri-delete-bin-2-line"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="mb-3 me-4">
                <Cleave
                  placeholder="Annéee"
                  options={{
                    date: true,
                    datePattern: ["Y"],
                    // limit: "2021",
                    dateMin: "2000" // Année minimale autorisée
                  }}
                  value={dateFormat}
                  onChange={(e) => onDateFormatChange(e)}
                  className="form-control"
                />
              </div>
            </Col>

            <Row>
              <Col className="view-animate">
                <Card id="contactList">
                  <CardBody className="pt-0">
                    <Row>
                      <Col
                        lg={10}
                        className="px-4">
                        {dateFormat?.length > 3 && dateMonthChoice && (
                          <div>
                            {moisDonnees ? (
                              <TableContainer
                                columns={columns}
                                data={moisDonnees[dateMonthChoice] || []}
                                isGlobalFilter={true}
                                customPageSize={8}
                                className="custom-header-css"
                                divClass="table-responsive table-card mb-3 "
                                tableClass="align-middle table-nowrap"
                                theadClass="table-light"
                                isContactsFilter={true}
                                SearchPlaceholder="Recherche..."
                              />
                            ) : (
                              <Loader />
                            )}
                          </div>
                        )}
                      </Col>
                      <Col lg={2}>
                        {dateFormat.length > 3 && (
                          <ListGroup className=" mt-3">
                            <ListGroupItem
                              tag="a"
                              to="#"
                              className="list-group-item-action active">
                              {dateFormat}
                            </ListGroupItem>
                            {MoisComponent()}
                          </ListGroup>
                        )}
                      </Col>
                    </Row>
                    <Modal
                      id="showModal"
                      isOpen={modal}
                      toggle={toggle}
                      centered
                      size="xl">
                      <ModalHeader
                        className="bg-soft-info p-3"
                        toggle={toggle}>
                        {!!isEdit ? "Modifier un salaire" : "Ajouter un salaire"}
                      </ModalHeader>
                      <ModalBody className="p-0">
                        <Formulaire
                          salId={salId}
                          onClose={toggle}
                          onUpdate={toggleRefresh}
                        />
                      </ModalBody>
                    </Modal>
                    <ToastContainer
                      closeButton={false}
                      limit={1}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Salary;
