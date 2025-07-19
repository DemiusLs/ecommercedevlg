import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import styles from './Checkout.module.css';

const Checkout = () => {
  const { cart, clearCart, products } = useAppContext();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discountValue, setDiscountValue] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    terms: false
  });


  const [errors, setErrors] = useState({});

  if (cart.length === 0) {
    return (
      <div className={styles.emptyCheckout}>
        <div className={styles.container}>
          <h2>Carrello vuoto</h2>
          <p>Aggiungi prodotti al carrello per completare l'acquisto.</p>
          <button onClick={() => navigate('/gallery')} className={styles.backButton}>
            Torna alla Galleria
          </button>
        </div>
      </div>
    );
  }

  const getDiscountedPrice = (item) => {
    return item.discount
      ? item.price - (item.price * item.discount) / 100
      : item.price;
  };

  const getSubtotal = () =>
    cart.reduce((total, item) => total + getDiscountedPrice(item) * item.quantity, 0);

  const getDiscountAmount = () => {
    return (getSubtotal() * discountValue) / 100;
  };

  const getShippingCost = () => {
  return getSubtotal()-getDiscountAmount() >= 75 ? 0 : 5.99;
};

  const getTotal = () => getSubtotal() - getDiscountAmount() + getShippingCost();

  const formatPrice = (price) => new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);

  const applyCoupon = async () => {
    setCouponError('');
    setDiscountValue(0);

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/discounts/${couponCode.trim()}`);
      if (res.data?.discount_value) {
        setDiscountValue(res.data.discount_value); // es: 15
      } else {
        setCouponError('Codice non valido.');
      }
    } catch (error) {
      setCouponError(error.response?.data?.message || 'Errore durante la verifica del codice.');
      setDiscountValue(0);
    }
  };

  const removeCoupon = () => setDiscount(null);

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

    if (!formData.email.trim() || !formData.email.includes('@') || !formData.email.includes('.')) {
      newErrors.email = "Per favore, inserisci un'email valida.";
      /*
          if (!formData.email) {
            newErrors.email = 'Email richiesta'
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Formato email non valido" */

    }
    if (!formData.phone) newErrors.phone = 'Telefono richiesto';
    if (!formData.address) newErrors.address = 'Indirizzo richiesto';
    if (!formData.city) newErrors.city = 'Città richiesta';
    if (!formData.postalCode) newErrors.postalCode = 'CAP richiesto';
    if (!formData.terms) newErrors.terms = 'Devi accettare i termini';

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Numero carta richiesto';
      if (!formData.expiryDate) newErrors.expiryDate = 'Data scadenza richiesta';
      if (!formData.cvv) newErrors.cvv = 'CVV richiesto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    // Blocco se coupon inserito ma non valido
    if (couponCode && discountValue === 0) {
      alert('Applica un codice sconto valido prima di completare l’ordine.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, {
        full_name: `${formData.firstName} ${formData.lastName}`,
        mail: formData.email,
        phone_number: formData.phone,
        billing_address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
        shipping_address: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
        order_status: 1,
        prints: cart.map(item => ({
          slug: item.slug,
          quantity_req: item.quantity
        })),
        discount_code: discountValue > 0 ? couponCode.trim() : null
      });

      const { total_price, order_id } = response.data;

      clearCart();
      setDiscountValue(0);
      setCouponCode('');
      alert(`Ordine confermato! Totale: €${total_price}\nRiceverai una email di conferma.`);
      navigate('/');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Errore durante il checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.checkout}>
      <div className={styles.container}>
        <h1 className={styles.title}>Checkout</h1>

        <div className={styles.checkoutGrid}>

          {/* FORM */}
          <div className={styles.checkoutForm}>
            <form onSubmit={handleSubmit}>
              {/* Sezione Contatto */}
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

              {/* Sezione Indirizzo */}
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

              {/* Metodo di pagamento */}
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Metodo di pagamento</h2>

                <div className={styles.paymentMethods}>
                  <label className={styles.paymentMethod}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                    />
                    <span>💳 Carta di credito</span>
                  </label>

                  <label className={styles.paymentMethod}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleInputChange}
                    />
                    <span>🅿️ PayPal</span>
                  </label>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className={styles.cardForm}>

                    <div className={styles.inputGroup}>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="Numero carta *"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className={errors.cardNumber ? styles.inputError : ''}
                      />
                      {errors.cardNumber && <span className={styles.error}>{errors.cardNumber}</span>}
                    </div>

                    <div className={styles.formGrid}>
                      <div className={styles.inputGroup}>
                        <input
                          type="text"
                          name="expiryDate"
                          placeholder="MM/AA *"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className={errors.expiryDate ? styles.inputError : ''}
                        />
                        {errors.expiryDate && <span className={styles.error}>{errors.expiryDate}</span>}
                      </div>

                      <div className={styles.inputGroup}>
                        <input
                          type="text"
                          name="cvv"
                          placeholder="CVV *"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className={errors.cvv ? styles.inputError : ''}
                        />
                        {errors.cvv && <span className={styles.error}>{errors.cvv}</span>}
                      </div>
                    </div>

                  </div>
                )}

              </div>

              {/* Termini e condizioni */}
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

              {/* Pulsante conferma */}
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Elaborazione...' : `Conferma Ordine - ${formatPrice(getTotal())}`}
              </button>
            </form>
          </div>

          {/* RIEPILOGO ORDINE */}
          <div className={styles.orderSummary}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Riepilogo Ordine</h3>

              <div className={styles.orderItems}>
                {cart.map((item, index) => {
                  const fullPrice = item.price * item.quantity;
                  const discountedPrice = getDiscountedPrice(item) * item.quantity;

                  return (
                    <div key={index} className={styles.orderItem}>
                      <img src={item.img_url} alt={item.name} className={styles.itemImage} />
                      <div className={styles.itemDetails}>
                        <span>{item.name}</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      {item.discount > 0 ? (
                        <div className={styles.priceGroup}>
                          <span className={styles.originalPrice}>{formatPrice(fullPrice)}</span>
                          <span className={styles.discountedPrice}>{formatPrice(discountedPrice)}</span>
                        </div>
                      ) : (
                        <span>{formatPrice(fullPrice)}</span>
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
                <div className={styles.summaryRow}>
                  <span>Subtotale</span>
                  <span>{formatPrice(getSubtotal())}</span>
                </div>

                {discountValue > 0 && (
                  <div className={styles.summaryRow}>
                    <span>Sconto</span>
                    <span>-{formatPrice(getDiscountAmount())}</span>
                  </div>
                )}

                <div className={styles.summaryRow}>
                  <span>Spedizione</span>
                  <span>{getShippingCost() === 0 ? 'Gratuita' : formatPrice(getShippingCost())}</span>
                </div>

                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Totale</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
