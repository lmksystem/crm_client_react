import React, { useEffect, useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { StripeService } from "../../services";
import { useProfile } from "../../Components/Hooks/UserHooks";

export default function CheckoutForm() {
  const { userProfile } = useProfile();
  const { state } = useLocation();
  let invoice = state.invoice;
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }

      setIsLoading(true);

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: clientSecret,
        metadata: {
          fen_id: invoice.header.fen_id,
          fen_ent_fk: invoice.header.fen_ent_fk,
          use_id: userProfile.use_id
        },
        confirmParams: {
          // Make sure to change this to your payment completion page
          return_url: process.env.REACT_APP_URL + "/complete?invoice_id=" + invoice.header.fen_id,
          receipt_email: userProfile.ent_email
        }
      });

      // This point will only be reached if there is an immediate error when
      // confirming the payment. Otherwise, your customer will be redirected to
      // your `return_url`. For some payment methods like iDEAL, your customer will
      // be redirected to an intermediate site first to authorize the payment, then
      // redirected to the `return_url`.
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    StripeService.createPaymentIntent({ currency: "eur", amount: parseInt(invoice.header.fen_total_ttc * 100) }).then((response) => {
      elements.update({ mode: "payment", amount: parseInt(invoice.header.fen_total_ttc * 100) });
      setClientSecret(response.clientSecret);
    });
  }, []);

  const paymentElementOptions = {
    layout: "accordion"
  };

  const appearance = {
    theme: "stripe"
  };

  // Enable the skeleton loader UI for optimal loading.
  const loader = "auto";

  return (
    <div className="checkout-form d-flex justify-content-center align-items-center my-5">
      <form
        className="my-5"
        id="payment-form"
        onSubmit={handleSubmit}>
        <PaymentElement
          id="payment-element"
          options={paymentElementOptions}
        />
        <button
          onClick={() => elements.submit()}
          disabled={isLoading || !stripe || !elements}
          id="submit">
          <span id="button-text">
            {isLoading ? (
              <div
                className="spinner"
                id="spinner"></div>
            ) : (
              "Payer"
            )}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    </div>
  );
}
