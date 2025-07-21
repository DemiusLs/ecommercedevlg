import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import styles from './Checkout.module.css';

import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({
  formData, setFormData, errors, setErrors, isSubmitting, setIsSubmitting,
  getTotal, clearCart, navigate
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart } = useAppContext();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'Nome richiesto';
    if (!formData.lastName) newErrors.lastName = 'Cognome richiesto';
    if (!formData.email || !formData.email.includes('@')) newErrors.email = 'Email valida richiesta';
    if (!formData.phone) newErrors.phone = 'Telefono richiesto';
    if (!formData.address) newErrors.address = 'Indirizzo richiesto';
    if (!formData.city) newErrors.city = 'Città richiesta';
    if (!formData.postalCode) newErrors.postalCode = 'CAP richiesto';
    if (!formData.terms) newErrors.terms = 'Devi accettare i termini';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!stripe || !elements) {
      console.error("Stripe o Elements non pronti");
      return;
    }

    setIsSubmitting(true);

    try {
      const cardElement = elements.getElement(CardElement);

      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/create-payment-intent`, {
        amount: Math.round(getTotal() * 100)
      });

      const client_secret = data.client_secret;

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: {
              line1: formData.address,
              city: formData.city,
              postal_code: formData.postalCode
            }
          }
        }
      });

      if (result.error) {
        alert(result.error.message);
        setIsSubmitting(false)
        return;
      }
if (result.paymentIntent.status === 'succeeded') {
  await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, {
        full_name: `${formData.firstName} ${formData.lastName}`,
        mail: formData.email,
        phone_number: formData.phone,
        billing_address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
        shipping_address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
        order_status: 1,
        payment_intent_id: result.paymentIntent.id,
        prints: cart.map(item => ({
          slug: item.slug,
          quantity_req: item.quantity
        }))
      });

      clearCart();
      alert('Pagamento completato e ordine confermato!');
      navigate('/');
}
      

    } catch (err) {
      console.error(err);
      alert('Errore durante il checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Informazioni di contatto</h2>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="firstName"
              placeholder="Nome *"
              value={formData.firstName}
              onChange={handleInputChange}
              className={errors.firstName ? styles.inputError : ''}
            />
            {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="lastName"
              placeholder="Cognome *"
              value={formData.lastName}
              onChange={handleInputChange}
              className={errors.lastName ? styles.inputError : ''}
            />
            {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
          </div>

          <div className={styles.inputGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? styles.inputError : ''}
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>

          <div className={styles.inputGroup}>
            <input
              type="tel"
              name="phone"
              placeholder="Telefono *"
              value={formData.phone}
              onChange={handleInputChange}
              className={errors.phone ? styles.inputError : ''}
            />
            {errors.phone && <span className={styles.error}>{errors.phone}</span>}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Indirizzo di fatturazione</h2>
        <div className={styles.formGrid}>
          <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
            <input
              type="text"
              name="address"
              placeholder="Indirizzo *"
              value={formData.address}
              onChange={handleInputChange}
              className={errors.address ? styles.inputError : ''}
            />
            {errors.address && <span className={styles.error}>{errors.address}</span>}
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="city"
              placeholder="Città *"
              value={formData.city}
              onChange={handleInputChange}
              className={errors.city ? styles.inputError : ''}
            />
            {errors.city && <span className={styles.error}>{errors.city}</span>}
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="postalCode"
              placeholder="CAP *"
              value={formData.postalCode}
              onChange={handleInputChange}
              className={errors.postalCode ? styles.inputError : ''}
            />
            {errors.postalCode && <span className={styles.error}>{errors.postalCode}</span>}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Pagamento con carta</h2>
        <div className={styles.cardForm}>
          <CardElement className={styles.stripeCardElement} />
        </div>
      </div>

      <label className={styles.checkbox}>
        <input
          type="checkbox"
          name="terms"
          checked={formData.terms}
          onChange={handleInputChange}
        />
        <span>Accetto i termini e condizioni *</span>
      </label>
      {errors.terms && <span className={styles.error}>{errors.terms}</span>}

      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? 'Elaborazione...' : `Conferma Ordine - €${getTotal()}`}
      </button>
    </form>
  );
};

const Checkout = () => {
  const { cart, clearCart } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', postalCode: '', terms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getSubtotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const getShippingCost = () => getSubtotal() >= 75 ? 0 : 5.99;
  const getTotal = () => getSubtotal() + getShippingCost();

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
          <div className={styles.checkoutForm}>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
                getTotal={getTotal}
                clearCart={clearCart}
                navigate={navigate}
              />
            </Elements>
          </div>

          <div className={styles.orderSummary}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Riepilogo Ordine</h3>
              <div className={styles.summaryRows}>
                <div className={styles.summaryRow}><span>Subtotale</span><span>€{getSubtotal()}</span></div>
                <div className={styles.summaryRow}><span>Spedizione</span><span>{getShippingCost() === 0 ? 'Gratis' : `€${getShippingCost()}`}</span></div>
                <div className={`${styles.summaryRow} ${styles.totalRow}`}><span>Totale</span><span>€{getTotal()}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
