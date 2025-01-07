import React from "react";

//import Scss
import "./assets/scss/themes.scss";

//imoprt Route
import Route from "./Routes";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ToastContainer } from "react-toastify";

function App() {
  const stripePromise = loadStripe("pk_test_51Qc2BiD1GB1IsmG6MGidjLgQ5un3lWuqMmGqYQc6qGvvXSkU3X5jes2GQpM7Cv881aW9n8JZWhFvBpAHavhE6tR500zFDZSxdj");
  return (
    <React.Fragment>
      <ToastContainer
        closeButton={false}
        limit={1}
      />
      <Elements
        stripe={stripePromise}
        options={{ mode: "setup", currency: "eur" }}>
        <Route />
      </Elements>
    </React.Fragment>
  );
}

export default App;
