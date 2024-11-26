import React, { useEffect, useState } from "react";
import { ProductService } from "../../services";
import { Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import SimpleBar from "simplebar-react";
import { useSelector } from "react-redux";

function ModalProducts({ modalProduct, toggleModalProduct = () => {}, onUpdate = () => {}, selected = [] }) {
  const { devise } = useSelector((state) => ({
    devise: state.Company.devise
  }));

  const [searchValueProduct, setSearchValueProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(selected);

  useEffect(() => {
    setSearchValueProduct("");
  }, [modalProduct]);

  useEffect(() => {
    ProductService.getProducts().then((res) => {
      setProducts(res);
    });
  }, []);

  return (
    <Modal
      id="showModal"
      isOpen={modalProduct}
      toggle={toggleModalProduct}
      centered>
      <ModalHeader
        className="bg-soft-info p-3"
        toggle={toggleModalProduct}>
        Sélectionnez un produit
      </ModalHeader>

      <ModalBody>
        <Row className="g-3">
          <Input
            type="text"
            className="form-control bg-light border-0"
            id="cart-total"
            placeholder="Recherche par nom"
            onChange={(e) => {
              setSearchValueProduct(e.target.value);
            }}
            value={searchValueProduct}
          />
          <SimpleBar
            autoHide={false}
            style={{ maxHeight: "220px" }}
            className="px-3">
            <div style={{ cursor: "pointer", zIndex: 5000, padding: 8, borderBottom: "0.5px solid #dddddd" }}>
              <Row>
                <Col lg={6}>
                  <b>Nom</b>
                </Col>
                <Col
                  className="text-end"
                  lg={2}>
                  <b>Tva</b>
                </Col>
                <Col
                  className="text-end"
                  lg={4}>
                  <b>Prix</b>
                </Col>
              </Row>
            </div>
            {products
              .filter((product) => product.pro_name.toLowerCase().includes(searchValueProduct.toLowerCase()))
              ?.map((p, key) => {
                let indexSelected = selectedProducts.findIndex((s) => s.pro_id == p.pro_id);
                let isSelected = indexSelected != -1 ? true : false;
                let fixedStyle = { cursor: "pointer", zIndex: 5000, padding: 8, marginTop: 1 };
                let styleSelected = isSelected ? { border: "3px solid #004D8560", borderRadius: 3, backgroundColor: "#004D8530" } : { borderBottom: "0.5px solid #dddddd" };

                return (
                  <div
                    style={{ ...styleSelected, ...fixedStyle }}
                    onClick={() => {
                      setSelectedProducts((selectProducts) => {
                        if (indexSelected != -1) {
                          return selectProducts.filter((ele, i) => i != indexSelected);
                        } else {
                          return [...selectProducts, p];
                        }
                      });
                    }}
                    key={key}>
                    <Row>
                      <Col lg={6}>{p.pro_name}</Col>
                      <Col
                        className="text-end"
                        lg={2}>
                        {p.pro_tva}%
                      </Col>
                      <Col
                        className="text-end"
                        lg={4}>
                        {p.pro_prix}
                        {devise}
                      </Col>
                    </Row>
                  </div>
                );
              })}
          </SimpleBar>
        </Row>
      </ModalBody>
      <ModalFooter>
        <div className="hstack gap-2 justify-content-end">
          <button
            type="button"
            className="btn btn-light"
            onClick={() => {
              onUpdate(selectedProducts);
              toggleModalProduct();
            }}>
            {" "}
            Valider{" "}
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default ModalProducts;
