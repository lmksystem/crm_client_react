import React, { useEffect, useState } from 'react';
import { Card, CardBody, Spinner } from 'reactstrap';
import ConfettiExplosion from 'react-confetti-explosion';

const ValideStep = ({ position, handleSubmit }) => {
  const [isExploding, setIsExploding] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <React.Fragment>

      <Card className={`mt-4 position-absolute w-100 ${position} element`} >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {isExploding && <ConfettiExplosion />}
        </div>
        <CardBody className="p-4">

          <div className="text-center mt-2">
            <h5 className="text-primary">Félicitation !</h5>
            <p className="text-muted">Génial il ne vous reste plus qu'à valider !</p>
          </div>
          {/* {error && error ? (<Alert color="danger"> {error} </Alert>) : null} */}
          <div className="p-2 mt-4 d-flex justify-content-center">

            <button disabled={loading} style={{ minWidth: "200px", }} onClick={() => {
              setIsExploding(true); setLoading(true); setTimeout(() => {
                handleSubmit();
              }, 800);
            }} className='btn btn-secondary'> {loading ? <Spinner size="sm" className='me-2'> Loading... </Spinner> : "Valider et commencer !"}</button>

          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default ValideStep;