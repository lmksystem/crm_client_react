import React, { useEffect, useMemo, useState } from "react";
import { Container } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { useLocation, useParams } from "react-router-dom";
import { RecurrenceService } from "../../services";

function RecurrenceOfEntity() {
  const { id } = useParams();

  const [data, setData] = useState([]);

  const columns = useMemo(() => [], []);

  useEffect(() => {
    RecurrenceService.getRecurrenceOfEntity(id).then((res) => {
      setData(res);
    });
  }, [id]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Récurrences" pageTitle="Facturation" />
        </Container>
      </div>
    </React.Fragment>
  );
}

export default RecurrenceOfEntity;
