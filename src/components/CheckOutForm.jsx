// src/components/CheckoutForm.jsx
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import styles from '../pages/Checkout.module.css';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';

const CheckoutForm = ({
    formData, setFormData,
    errors, setErrors,
    isSubmitting, setIsSubmitting,
    discountValue, couponCode,
    getTotal, getDiscountAmount, getShippingCost, getSubtotal,
    clearCart, navigate, formatPrice
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
        if (!formData.phone ) newErrors.phone = 'Telefono richiesto';
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
            alert("Stripe non è pronto.");
            return;
        }

        setIsSubmitting(true);

        try {
            const cardElement = elements.getElement(CardElement);

            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/create-payment-intent`, {
                amount: Math.round(getTotal() * 100)
            });

            const result = await stripe.confirmCardPayment(data.client_secret, {
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
                setIsSubmitting(false);
                return;
            }

            if (result.paymentIntent.status === 'succeeded') {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, {
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
                    })),
                    discount_code: discountValue > 0 ? couponCode.trim() : null
                });

                clearCart();
                alert(`Ordine confermato! Totale: €${response.data.total_price}`);
                navigate('/');
            }

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || 'Errore durante il checkout.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (

        <>
            < div className={styles.checkoutForm} >
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
            </div >
        </>

    );
};

export default CheckoutForm;
