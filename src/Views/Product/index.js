import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";

import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  ModalFooter,
  FormFeedback
} from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";

//Import actions
import {
  getProducts as onGetProducts,
  addProduct as onAddProduct,
  getTva as onGetTva,
  deleteProduct as onDeleteProduct,
  updateProduct as onUpdateProduct
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

const Products = () => {
  const dispatch = useDispatch();
  const { products, isProductSuccess, error, tva, devise } = useSelector((state) => ({
    products: state.Product.products,
    isProductSuccess: state.Product.isProductSuccess,
    error: state.Product.error,
    tva: state.Gestion.tva,
    devise: state.Company.devise
  }));

  const [product, setProduct] = useState([]);

  useEffect(() => {
    dispatch(onGetProducts());
    dispatch(onGetTva());
  }, [dispatch]);

  // useEffect(() => {
  //   if (!isEmpty(product)) {
  //     console.log(product);
  //     setIsEdit(false);
  //   }
  // }, [product]);


  const [isEdit, setIsEdit] = useState(false);


  //delete Conatct
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setProduct(null);
      setIsEdit(false);
    } else {
      setModal(true);
    }
  }, [modal]);

  // Delete Data
  const handleDeleteProduct = () => {
    if (product) {
      dispatch(onDeleteProduct(product.pro_id));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (product) => {
    setProduct(product);
    setDeleteModal(true);
  };

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {

      pro_name: (product && product.pro_name) || "",
      pro_detail: (product && product.pro_detail) || "",
      pro_prix: (product && product.pro_prix) || 0,
      pro_tva: (product && product.pro_tva) || 0,
    },
    validationSchema: Yup.object({
      pro_name: Yup.string().required("Veuillez entrer un nom"),
      pro_detail: Yup.string().required("Veuillez entrer une description"),
      pro_prix: Yup.number().required("Veuillez entrer une valeur"),
      pro_tva: Yup.number().required("Veuillez entrer une valeur"),
    }),
    onSubmit: (values) => {
      values.pro_tva = parseFloat(values.pro_tva)
      if (isEdit) {
        // update tva
        values.pro_id = (product && product.pro_id) || 0;
        dispatch(onUpdateProduct(values));
        validation.resetForm();

      } else {
        // save new tva
        dispatch(onAddProduct(values));
        validation.resetForm();
      }
      toggle();
    },
  });

  // Update Data
  const handleProductClick = useCallback((arg) => {
    const product = arg;

    setProduct({
      pro_id: product.pro_id,
      pro_name: product.pro_name,
      pro_detail: product.pro_detail,
      pro_tva: product.pro_tva,
      pro_prix: product.pro_prix,
    });

    setIsEdit(true);
    toggle();
  }, [toggle]);

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".tvaCheckBox");

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
      // console.log(element.value);
      dispatch(onDeleteTva(element.value));
      setTimeout(() => { toast.clearWaitingQueue(); }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".tvaCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  // Column
  const columns = useMemo(
    () => [
      {
        Header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
        Cell: (cellProps) => {
          return <input type="checkbox" className="tvaCheckBox form-check-input" value={cellProps.row.original.pro_id} onChange={() => deleteCheckbox()} />;
        },
        id: '#',
      },
      {
        id: "hidden-id",
        accessor: 'pro_id',
        hiddenColumns: true,
        Cell: (cell) => {
          return <input type="hidden" value={cell.value} />;
        }
      },
      {
        Header: "Nom",
        accessor: "pro_name",
      },
      {
        Header: "Détail",
        accessor: "pro_detail",
        filterable: false,
      },
      {
        Header: "Prix",
        accessor: "pro_prix",
        filterable: false,
        Cell: (cell) => {
          return <div>{cell.value ? cell.value + devise : <i>Non renseigné</i>}</div>;
        }
      },
      {
        Header: "Tva",
        accessor: "pro_tva",
        filterable: false,
        Cell: (cell) => {
          return <div>{cell.value ? cell.value + "%" : <i>Non renseigné</i>}</div>;
        }
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          let product = cellProps.row.original;
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit" title="Call">
                <Link to="#" onClick={() => { handleProductClick(product) }} className="text-primary d-inline-block edit-item-btn">
                  <i className="ri-pencil-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item edit" title="Call">
                <Link to="#" onClick={() => { onClickDelete(product) }} className="text-danger d-inline-block remove-item-btn">
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </li>

            </ul>
          );
        },
      },
    ],
    [handleProductClick, checkedAll]
  );

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "Produits | Countano";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={products}
        />

        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteProduct}
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
          <BreadCrumb title="Produits" pageTitle="Gestion" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex align-items-center flex-wrap gap-2 ">
                    <div className="d-flex flex-grow-1 justify-content-start">
                      <button
                        className="btn btn-secondary add-btn"
                        onClick={() => {
                          setModal(true);
                        }}
                      >
                        <i className="ri-add-fill me-1 align-bottom"></i>
                        Ajouter un produit
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


                <CardBody className="pt-0">
                  <div>

                    {isProductSuccess ? (

                      <TableContainer
                        columns={columns}
                        data={(products || [])}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={7}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-2"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        isCompaniesFilter={false}
                        isProductsFilter={true}
                        SearchPlaceholder='Recherche...'
                      />

                    ) : (<Loader error={error} />)
                    }
                  </div>
                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                    <ModalHeader className="bg-soft-info p-3" toggle={toggle}>
                      {!!isEdit ? "Modifier produit" : "Ajouter produit"}
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}>
                      <ModalBody>
                        <input type="hidden" id="id-field" />
                        <Row className="g-3">
                          <Col lg={12}>

                            <div>
                              <Label
                                htmlFor="pro_name-field"
                                className="form-label"
                              >
                                Nom
                              </Label>
                              <Input
                                name="pro_name"
                                id="pro_name-field"
                                className="form-control"
                                placeholder="Entrer un nom"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.pro_name || ""}
                                invalid={
                                  validation.touched.pro_name && validation.errors.pro_name ? true : false
                                }
                              />
                              {validation.touched.pro_name && validation.errors.pro_name ? (
                                <FormFeedback type="invalid">{validation.errors.pro_name}</FormFeedback>
                              ) : null}
                            </div>

                          </Col>
                          <Col lg={12}>

                            <div>
                              <Label
                                htmlFor="pro_detail-field"
                                className="form-label"
                              >
                                Détail
                              </Label>
                              <Input
                                name="pro_detail"
                                id="pro_detail-field"
                                className="form-control"
                                placeholder="Entrer un détail"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.pro_detail || ""}
                                invalid={
                                  validation.touched.pro_detail && validation.errors.pro_detail ? true : false
                                }
                              />
                              {validation.touched.pro_detail && validation.errors.pro_detail ? (
                                <FormFeedback type="invalid">{validation.errors.pro_detail}</FormFeedback>
                              ) : null}
                            </div>

                          </Col>
                          <Col lg={6}>

                            <div>
                              <Label
                                htmlFor="pro_tva-field"
                                className="form-label"
                              >
                                Tva
                              </Label>
                              <Input
                                name="pro_tva"
                                id="pro_tva-field"
                                className="form-control"
                                placeholder="Entrer une tva"
                                type="select"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.pro_tva || 0}
                                invalid={
                                  validation.touched.pro_tva && validation.errors.pro_tva ? true : false
                                }
                              >
                                <option value={0}>Sélectionnez une Tva</option>
                                {tva?.map((e, i) => <option {...e.value == product?.pro_tva ? "selected" : ""} key={i} value={e.tva_value}>{e.tva_libelle}</option>)}
                              </Input>
                              {validation.touched.pro_tva && validation.errors.pro_tva ? (
                                <FormFeedback type="invalid">{validation.errors.pro_tva}</FormFeedback>
                              ) : null}
                            </div>

                          </Col>
                          <Col lg={6}>

                            <div>
                              <Label
                                htmlFor="pro_detail-field"
                                className="form-label"
                              >
                                Prix (HT)
                              </Label>
                              <Input
                                name="pro_prix"
                                id="pro_prix-field"
                                className="form-control"
                                placeholder="Entrer un prix"
                                type="number"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.pro_prix || ""}
                                invalid={
                                  validation.touched.pro_prix && validation.errors.pro_prix ? true : false
                                }
                              />
                              {validation.touched.pro_prix && validation.errors.pro_prix ? (
                                <FormFeedback type="invalid">{validation.errors.pro_prix}</FormFeedback>
                              ) : null}
                            </div>

                          </Col>
                        </Row>
                      </ModalBody>
                      <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                          <button type="button" className="btn btn-light" onClick={() => { setModal(false); }} > Fermer </button>
                          <button type="submit" className="btn btn-success" id="add-btn" >  {!!isEdit ? "Modifier" : "Ajouter un produit"} </button>
                        </div>
                      </ModalFooter>
                    </Form>
                  </Modal>
                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>

              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Products;
