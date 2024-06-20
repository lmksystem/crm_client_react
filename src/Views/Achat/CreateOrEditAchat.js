import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getOnceAchat } from "../../helpers/backend_helper";
import FormAchat from "./FormAchat";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Card, CardBody, Container } from "reactstrap";
import { ToastContainer } from "react-toastify";

function CreateOrEditAchat() {
  const { state } = useLocation();

  const navigate = useNavigate();

  const [listOfAchat, setListOfAchat] = useState(null);
  const [numberValidate, setNumberValidate] = useState(0);

  const loadAchat = async () => {
    if (state) {
      let copy = [];
      for (let index = 0; index < state.length; index++) {
        const ach_id = state[index];

        let res = await getOnceAchat(ach_id);

        copy.push(res.data);
      }

      setListOfAchat(copy);
    }
  };

  const handleOneValidate = () => {
    setNumberValidate(() => numberValidate + 1);
  };

  useEffect(() => {
    loadAchat();
  }, []);

  useEffect(() => {
    if (listOfAchat && numberValidate == listOfAchat.length) {
      navigate("/achat");
    }
  }, [numberValidate]);

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

          {listOfAchat &&
            listOfAchat?.map((data) => {
              return (
                <Card key={data.ach_id}>
                  <CardBody className="">
                    <FormAchat
                      handleOneValidate={handleOneValidate}
                      data={data}
                    />
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
