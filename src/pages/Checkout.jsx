import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

import { useAppContext } from "../context/AppContext";
import styles from "./Checkout.module.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ cart, getSubtotal, getDiscountAmount, getShippingCost, getTotal, formatPrice, discountValue, couponCode, setCouponCode, couponError, applyCoupon, clearCart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    postalCode: "",
    terms: false,
    paymentMethod: "card"
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/create-payment-intent`, {
        amount: Math.round(getTotal() * 100),
      });

      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: {
              line1: formData.address1,
              line2: formData.address2,
              postal_code: formData.postalCode
            }
          }
        }
      });

      if (result.error) {
        alert(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          alert("✅ Ordine completato!");
          clearCart();
          navigate("/thank-you");

        }
      }
    } catch (err) {
      console.error(err);
      alert("Errore durante il pagamento");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.checkoutForm}>
      <h3>Indirizzo di fatturazione</h3>

      <div className={styles.formGroup}>
        <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Nome" required />
        <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Cognome" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefono" required />
        <input name="address1" value={formData.address1} onChange={handleChange} placeholder="Indirizzo" required />
        <input name="address2" value={formData.address2} onChange={handleChange} placeholder="Indirizzo (opzionale)" />
        <input name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="CAP" required />
      </div>

      <h3>Metodo di pagamento</h3>

      <div className={styles.formGroup}>
        
        <label><input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === "card"} onChange={handleChange} /> Carta di credito</label>
        <label><input type="radio" name="paymentMethod" value="paypal" checked={formData.paymentMethod === "paypal"} onChange={handleChange} /> PayPal</label>
      </div>

      <CardElement />

      <div className={styles.formGroup}>
        <label><input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} required /> Accetto i termini e condizioni</label>
      </div>

      <button type="submit" disabled={!stripe || loading || !formData.terms}>
        {loading ? "Elaborazione..." : `Conferma Ordine - ${formatPrice(getTotal())}`}
      </button>
    </form>
  );
};

const Checkout = () => {
  const { cart, clearCart } = useAppContext();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discountValue, setDiscountValue] = useState(0);
  const [couponError, setCouponError] = useState('');

  const getDiscountedPrice = (item) => {
    return item.discount ? item.price - (item.price * item.discount) / 100 : item.price;
  };

  const getSubtotal = () => cart.reduce((total, item) => total + getDiscountedPrice(item) * item.quantity, 0);

  const getDiscountAmount = () => (getSubtotal() * discountValue) / 100;

  const getShippingCost = () => getSubtotal() - getDiscountAmount() >= 75 ? 0 : 5.99;

  const getTotal = () => getSubtotal() - getDiscountAmount() + getShippingCost();

  const formatPrice = (price) => new Intl.NumberFormat('it-IT', {
    style: 'currency', currency: 'EUR'
  }).format(price);

  const applyCoupon = async () => {
    setCouponError('');
    setDiscountValue(0);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/discounts/${couponCode.trim()}`);
      if (res.data?.discount_value) {
        setDiscountValue(res.data.discount_value);
      } else {
        setCouponError('Codice non valido.');
      }
    } catch (error) {
      setCouponError(error.response?.data?.message || 'Errore durante la verifica del codice.');
      setDiscountValue(0);
    }
  };

  if (cart.length === 0) {
    return (
      <div className={styles.emptyCheckout}>
        <div className={styles.container}>
          <h2>Carrello vuoto</h2>
          <button onClick={() => navigate('/gallery')} className={styles.backButton}>
            Torna alla Galleria
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkout}>
      <div className={styles.container}>
        <h1 className={styles.title}>Checkout</h1>
        <div className={styles.checkoutGrid}>
          <Elements stripe={stripePromise}>
            <CheckoutForm
              cart={cart}
              getSubtotal={getSubtotal}
              getDiscountAmount={getDiscountAmount}
              getShippingCost={getShippingCost}
              getTotal={getTotal}
              formatPrice={formatPrice}
              discountValue={discountValue}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              couponError={couponError}
              applyCoupon={applyCoupon}
              clearCart={clearCart}
            />
          </Elements>

          <div className={styles.orderSummary}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Riepilogo Ordine</h3>

              <div className={styles.orderItems}>
                {cart.map((item, index) => (
                  <div key={index} className={styles.orderItem}>
                    <img src={item.img_url} alt={item.name} className={styles.itemImage} />
                    <div className={styles.itemDetails}>
                      <span>{item.name}</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                    <span>{formatPrice(getDiscountedPrice(item) * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className={styles.couponSection}>
                <div className={styles.couponInput}>
                  <input
                    type="text"
                    placeholder="Codice sconto"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={discountValue > 0}
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={discountValue > 0 || !couponCode.trim()}
                  >
                    Applica
                  </button>
                </div>
                {couponError && <div className={styles.error}>{couponError}</div>}
                {discountValue > 0 && (
                  <div className={styles.appliedCoupon}>
                    <span>Sconto {discountValue}% applicato</span>
                    <button type="button" onClick={() => {
                      setDiscountValue(0);
                      setCouponCode('');
                      setCouponError('');
                    }}>Rimuovi</button>
                  </div>
                )}
              </div>

              <div className={styles.summaryRows}>
                <div className={styles.summaryRow}><span>Subtotale</span><span>{formatPrice(getSubtotal())}</span></div>
                {discountValue > 0 && <div className={styles.summaryRow}><span>Sconto</span><span>-{formatPrice(getDiscountAmount())}</span></div>}
                <div className={styles.summaryRow}><span>Spedizione</span><span>{getShippingCost() === 0 ? 'Gratuita' : formatPrice(getShippingCost())}</span></div>
                <div className={`${styles.summaryRow} ${styles.totalRow}`}><span>Totale</span><span>{formatPrice(getTotal())}</span></div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
