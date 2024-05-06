import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getOnceAchat } from "../../helpers/backend_helper";
import FormAchat from "./FormAchat";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Card, CardBody, Container } from "reactstrap";
import { ToastContainer } from "react-toastify";

function CreateOrEditAchat() {
  const { state } = useLocation();

  const [listOfAchat, setListOfAchat] = useState([]);

  const loadAchat = async () => {
    if (state) {
      let copy = [...listOfAchat];
      for (let index = 0; index < state.length; index++) {
        const ach_id = state[index];

        let res = await getOnceAchat(ach_id);

        copy.push(res.data);
      }

      setListOfAchat(copy);
    }
  };

  useEffect(() => {
    loadAchat();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Factures Achats"
            pageTitle="Banque / Achat"
          />
          <ToastContainer
            closeButton={false}
            limit={1}
          />

          {listOfAchat.length > 0 &&
            listOfAchat.map((data) => {
              return (
                <Card key={data.ach_id}>
                  <CardBody className="">
                    <FormAchat data={data} />
                  </CardBody>
                </Card>
              );
            })}
        </Container>
      </div>
    </React.Fragment>
  );
}

export default CreateOrEditAchat;
