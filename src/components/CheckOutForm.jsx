// src/components/CheckoutForm.jsx
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import styles from './Checkout.module.css';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';

const CheckoutForm = ({
    formData, setFormData,
    errors, setErrors,
    isSubmitting, setIsSubmitting,
    discountValue, couponCode,
    getTotal, getDiscountAmount, getShippingCost, getSubtotal,
    clearCart, navigate
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
        <form onSubmit={handleSubmit}>
            {/* Tutti i campi del form come nel codice che hai già */}
            {/* CardElement + Termini + Pulsante conferma */}
        </form>
    );
};

export default CheckoutForm;
