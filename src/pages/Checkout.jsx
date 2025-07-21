// src/pages/Checkout.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

import { useAppContext } from '../context/AppContext';
import CheckoutForm from '../components/CheckOutForm';
import styles from './Checkout.module.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout = () => {
  const { cart, clearCart } = useAppContext();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discountValue, setDiscountValue] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', postalCode: '', terms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          <div className={styles.checkoutForm}>
            <Elements stripe={stripePromise}>
              <CheckoutForm
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
                discountValue={discountValue}
                couponCode={couponCode}
                getTotal={getTotal}
                getSubtotal={getSubtotal}
                getDiscountAmount={getDiscountAmount}
                getShippingCost={getShippingCost}
                clearCart={clearCart}
                navigate={navigate}
                formatPrice={formatPrice}
              />
            </Elements>
          </div>

          <div className={styles.orderSummary}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Riepilogo Ordine</h3>

              <div className={styles.orderItems}>
                {cart.map((item, index) => {
                  const full = item.price * item.quantity;
                  const discounted = getDiscountedPrice(item) * item.quantity;
                  return (
                    <div key={index} className={styles.orderItem}>
                      <img src={item.img_url} alt={item.name} className={styles.itemImage} />
                      <div className={styles.itemDetails}>
                        <span>{item.name}</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      {item.discount > 0 ? (
                        <div className={styles.priceGroup}>
                          <span className={styles.originalPrice}>{formatPrice(full)}</span>
                          <span className={styles.discountedPrice}>{formatPrice(discounted)}</span>
                        </div>
                      ) : (
                        <span>{formatPrice(full)}</span>
                      )}
                    </div>
                  );
                })}
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
                    <span>Codice "{couponCode}" applicato - Sconto {discountValue}%</span>
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