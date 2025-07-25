# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

-------DA COMPLETARE-------------------
12. assistente AI (coefficiente: 5)
chatbot che aiuta gli utenti a trovare risposte sul prodotto visualizzato



-----TASK EXTRA COMPLETATE NON ANCORA SEGNATE DA AVVISARE LORIS----
5. wishlist (coefficiente: 2)
aggiunta/rimozione prodotti da una lista dei desideri
visualizzazione della lista in una pagina dedicata
-------------------------------------------
10. confronta prodotti (coefficiente: 3)
possibilità di selezionare fino a 3 prodotti e confrontarli in tabella
-----------------------------------------------
7. prodotti correlati (coefficiente: 2)
visualizzare i prodotti correlati nella pagina di dettaglio di un prodotto
----------------------------------------------------------------
6. paginazione dei risultati (coefficiente: 2)
implementare un sistema di paginazione per i risultati di ricerca
possibilità di selezionare il numero di prodotti da visualizzare per pagina
mantenere i filtri applicati durante il passaggio tra le pagine
-------------------------------------------------
11. pagamento (coefficiente: 4)
integrare un sistema di pagamento simulato 
------------------------------------


import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/create-payment-intent`, {
        amount: 1000, // €10.00 in centesimi
      });

      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        alert(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          alert("✅ Pagamento completato!");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Errore durante il pagamento");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Elaborazione..." : "Conferma e Paga"}
      </button>
    </form>
  );
};

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
