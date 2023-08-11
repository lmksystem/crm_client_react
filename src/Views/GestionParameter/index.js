import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import * as moment from "moment";

// Import Images
import dummyImg from "../../assets/images/users/user-dummy-img.jpg";

import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  ModalFooter,
  Table,
  FormFeedback
} from "reactstrap";
import Select from "react-select";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";

//Import actions
import {
  getContacts as onGetContacts,
  addNewContact as onAddNewContact,
  updateContact as onUpdateContact,
  deleteContact as onDeleteContact,
  getCollaborateurs as onGetCollaborateurs,
} from "../../slices/thunks";
//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../Components/Common/TableContainer";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";

const GestionParameter = () => {
  const dispatch = useDispatch();
  const { contacts, collaborateurs, isContactSuccess, error } = useSelector((state) => ({
    contacts: state.Gestion.contacts,
    collaborateurs: state.Gestion.collaborateurs,
    isContactSuccess: state.Gestion.isContactSuccess,
    isCollaborateurSuccess: state.Gestion.isCollaborateurSuccess,
    error: state.Gestion.error,
  }));

  useEffect(() => {
    if (contacts && !contacts.length) {
      dispatch(onGetContacts());
      dispatch(onGetCollaborateurs());
    }
  }, [dispatch, contacts]);

  useEffect(() => {
    setContact(contacts);
  }, [contacts]);

  useEffect(() => {
    if (!isEmpty(contacts)) {
      setContact(contacts);
      setIsEdit(false);
    }
  }, [contacts]);


  const [isEdit, setIsEdit] = useState(false);
  const [contact, setContact] = useState([]);

  const [collaborateurList, setCollaborateurList] = useState([]);
  const [collaborateur, setCollaborateur] = useState(null);

  //delete Conatct
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [show, setShow] = useState(false);

  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setContact(null);
      setCollaborateur(null)
    } else {
      setModal(true);
    }
  }, [modal]);

  // Delete Data
  const handleDeleteContact = () => {
    if (contact) {
      dispatch(onDeleteContact(contact.epe_id));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (contact) => {
    setContact(contact);
    setDeleteModal(true);
  };

  // Add Data
  const handleContactClicks = () => {
    setContact("");
    setIsEdit(false);
    toggle();
  };

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      // contactId: (contact && contact.contactId) || '',
      // img: (contact && contact.img) || '',
      lastname: (contact && contact.lastname) || '',
      firstname: (contact && contact.firstname) || '',
      email: (contact && contact.email) || '',
      phone: (contact && contact.phone) || '',
      job: (contact && contact.job) || '',
      info: (contact && contact.info) || '',
      // phone: (contact && contact.phone) || '',
      // lead_score: (contact && contact.lead_score) || '',
      // tags: (contact && contact.tags) || [],
    },
    validationSchema: Yup.object({
      // contactId: Yup.string().required("Please Enter Contact Id"),
      lastname: Yup.string().required("Veuillez entrer un nom"),
      firstname: Yup.string().required("Veuillez entrer un prénom"),
      email: Yup.string().required("Veuillez entrer un email"),
      phone: Yup.string().required("Veuillez entrer un téléphone"),
      job: Yup.string(),
      info: Yup.string(),
    }),
    onSubmit: (values) => {
      if (isEdit) {

        const updateContact = {
          epe_id: contact ? contact.id : 0,
          epe_lastname: values.lastname,
          epe_firstname: values.firstname,
          epe_email: values.email,
          epe_phone: values.phone,
          epe_job: values.job,
          epe_info: values.info,
          epe_ent_fk: collaborateur.value,
          ent_name: collaborateur.label,
        };
        
        // update Contact
        dispatch(onUpdateContact(updateContact));
        validation.resetForm();

      } else {
        const newContact = {
          epe_lastname: values["lastname"],
          epe_firstname: values["firstname"],
          epe_email: values["email"],
          epe_phone: values["phone"],
          epe_job: values["job"],
          epe_info: values["info"],
          epe_ent_fk: collaborateur.value,
          ent_name: collaborateur.label,
        };

        // save new Contact
        dispatch(onAddNewContact(newContact));
        validation.resetForm();
      }
      toggle();
    },
  });

  // Update Data
  const handleContactClick = useCallback((arg) => {
    const contact = arg;

    setContact({
      id: contact.epe_id,
      lastname: contact.epe_lastname,
      firstname: contact.epe_firstname,
      email: contact.epe_email,
      phone: contact.epe_phone,
      job: contact.epe_job,
      info: contact.epe_info,
    });

    setIsEdit(true);
    toggle();
  }, [toggle]);

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

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(onDeleteContact(element.value));
      setTimeout(() => { toast.clearWaitingQueue(); }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
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
        Header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
        Cell: (cellProps) => {
          return <input type="checkbox" className="contactCheckBox form-check-input" value={cellProps.row.original.epe_id} onChange={() => deleteCheckbox()} />;
        },
        id: '#',
      },
      {
        Header: '',
        accessor: 'epe_id',
        hiddenColumns: true,
        Cell: (cell) => {
          return <input type="hidden" value={cell.value} />;
        }
      },
      {
        Header: "Entreprise",
        accessor: "ent_name",
        filterable: false,
      },
      {
        Header: "Nom",
        accessor: "epe_lastname",
        filterable: false,
      },
      {
        Header: "Prénom",
        accessor: "epe_firstname",
        filterable: false,
      },
      {
        Header: "Email",
        accessor: "epe_email",
        filterable: false,
      },
      {
        Header: "Téléphone",
        accessor: "epe_phone",
        filterable: false,
        // Cell: (cell) => (
        //   <>
        //     {handleValidDate(cell.value)}
        //   </>
        // ),
      },
      {
        Header: "Poste",
        accessor: "epe_job",
        Cell: (cell) => {
          return <span className="badge text-uppercase badge-soft-success"> {cell.value} </span>;
        }
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit" title="Call">
                <Link to="#" className="text-muted d-inline-block">
                  <i className="ri-phone-line fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item">
                <UncontrolledDropdown>
                  <DropdownToggle
                    href="#"
                    className="btn btn-soft-secondary btn-sm dropdown"
                    tag="button"
                  >
                    <i className="ri-more-fill align-middle"></i>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end">
                    <DropdownItem className="dropdown-item" href="#"
                      onClick={() => { const contactData = cellProps.row.original; setInfo(contactData); setShow(true); }}
                    >
                      <i className="ri-eye-fill align-bottom me-2 text-muted"></i>{" "}
                      Voir
                    </DropdownItem>
                    <DropdownItem
                      className="dropdown-item edit-item-btn"
                      href="#"
                      onClick={() => {
                        const contactData = cellProps.row.original;

                        setCollaborateur(collaborateurList.filter((c) => c.value == contactData.epe_ent_fk)[0]);
                        handleContactClick(contactData);
                      }}
                    >
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{" "}
                      Modifier
                    </DropdownItem>
                    <DropdownItem
                      className="dropdown-item remove-item-btn"
                      href="#"
                      onClick={() => { const contactData = cellProps.row.original; onClickDelete(contactData); }}
                    >
                      <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
                      Supprimer
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </li>
            </ul>
          );
        },
      },
    ],
    [handleContactClick, checkedAll, collaborateurList]
  );

  useEffect(() => {
    if (collaborateurs) {
      setCollaborateurList(collaborateurs.map((c) => ({ label: c.ent_name, value: c.ent_id })))
    }
  }, [collaborateurs])

  function handlestag(collaborateur) {
    console.log(collaborateur);
    setCollaborateur(collaborateur);
  }

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        document.getElementById('start-anime').classList.add("show")
      }, 200);
    }
  }, [show])


  // SideBar Contact Deatail
  const [info, setInfo] = useState([]);

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "Contacts | Countano";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={contacts}
        />

        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteContact}
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
          <BreadCrumb title="Contacts" pageTitle="Gestion" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex align-items-center flex-wrap gap-2 ">
                    <div className="d-flex flex-grow-1 justify-content-end">
                      <button
                        className="btn btn-info add-btn"
                        onClick={() => {
                          setModal(true);
                        }}
                      >
                        <i className="ri-add-fill me-1 align-bottom"></i> Ajouter
                        Contact
                      </button>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="hstack text-nowrap gap-2">
                        {isMultiDeleteButton && <button className="btn btn-danger"
                          onClick={() => setDeleteModalMulti(true)}
                        ><i className="ri-delete-bin-2-line"></i></button>}

                        {/* <button className="btn btn-soft-success" onClick={() => setIsExportCSV(true)}>Export</button> */}

                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Col>
           
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default GestionParameter;
