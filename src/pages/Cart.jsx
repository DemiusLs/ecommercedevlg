import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import styles from './Cart.module.css';
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

const Cart = () => {
  const { cart, clearCart, removeFromCart, setCart, products } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClearCart = () => {
    clearCart();
    setIsModalOpen(false);
  };


  const updateQuantity = (slug, newQuantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.slug === slug
          ? {
            ...item,
            quantity:
              newQuantity > item.maxStock
                ? item.maxStock
                : newQuantity < 1
                  ? 1
                  : newQuantity,
          }
          : item
      )
    );
  };

  const removeItem = slug => {
    removeFromCart(slug);
  };

  const getDiscountedPrice = (item) =>
    item.discount > 0
      ? item.price * (1 - item.discount / 100)
      : item.price;

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const discountedPrice = getDiscountedPrice(item);
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const freeShippingThreshold = 75;
  const totalPrice = getTotalPrice();
  const needsForFreeShipping = freeShippingThreshold - totalPrice;


  // interfaccia se il carrello è vuoto
  if (cart.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🛒</div>
            <h2 className={styles.emptyTitle}>Il tuo carrello è vuoto</h2>
            <p className={styles.emptyDescription}>
              Aggiungi alcuni prodotti per iniziare lo shopping
            </p>
            <Link to="/gallery" className={styles.shopButton}>
              Esplora la Galleria
            </Link>
          </div>
        </div>
      </div>
    );
  }


  // interfaccia se ci sono prodotti nel carrello
  return (
    <div className={styles.cart}>
      <div className={styles.container}>
        <h1 className={styles.title}>Carrello ({cart.length})</h1>

        {needsForFreeShipping > 0 && (
          <div className={styles.shippingBanner}>
            <span className={styles.shippingIcon}>🚚</span>
            Aggiungi {formatPrice(needsForFreeShipping)} per la spedizione gratuita!
          </div>
        )}

        <div className={styles.cartContent}>

          {/* CARD PRODOTTO */}
          <div className={styles.cartItems}>
            {cart.map((item) => {
              const discountedPrice = getDiscountedPrice(item);
              const totalItemPrice = discountedPrice * item.quantity;
              return (

                // immagine prodotto
                <div key={item.slug} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img src={item.img_url} alt={item.name} />
                  </div>

                  {/* nome prodotto, prezzo originale, prezzo scontato e gestione disponibilità */}
                  <div className={styles.itemInfo}>
                    <h3 className={styles.itemName}>{item.name}</h3>

                    {item.discount > 0 ? (
                      <div className={styles.priceGroup}>
                        <span className={styles.originalPrice}>
                          {formatPrice(item.price)}
                        </span>
                        <span className={styles.discountedPrice}>
                          {formatPrice(discountedPrice)}
                        </span>
                      </div>
                    ) : (
                      <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                    )}

                    <span className={item.maxStock > 0 ? styles.inStock : styles.outOfStock}>
                      {item.maxStock > 0
                        ? item.maxStock < 5
                          ? `Solo ${item.maxStock} rimasti`
                          : 'Disponibile'
                        : 'Non disponibile'}
                    </span>
                  </div>

                  {/* gestione di aggiungere o togliere lo stesso prodotto + rimuove il prodotto dal carrello */}
                  <div className={styles.itemActions}>
                    <div className={styles.quantityControls}>
                      <button
                        className={styles.quantityButton}
                        onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        className={styles.quantityButton}
                        onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className={styles.removeButton}
                      onClick={() => removeItem(item.slug)}
                    >
                      Rimuovi
                    </button>
                  </div>

                  {/* prezzo totale */}
                  <div className={styles.itemTotal}>
                    {formatPrice(totalItemPrice)}
                  </div>
                </div>
              );
            })}
          </div>


          {/* RIEPILOGO ORDINE */}
          <div className={styles.cartSummary}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Riepilogo Ordine</h3>


              {/* subtotale */}
              <div className={styles.summaryRow}>
                <span>Subtotale</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>


              {/* spedizione */}
              <div className={styles.summaryRow}>
                <span>Spedizione</span>
                <span>
                  {totalPrice >= freeShippingThreshold ? (
                    <span className={styles.freeShipping}>Gratuita</span>
                  ) : (
                    formatPrice(5.99)
                  )}
                </span>
              </div>


              {/* totale */}
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Totale</span>
                <span>
                  {formatPrice(
                    totalPrice + (totalPrice >= freeShippingThreshold ? 0 : 5.99)
                  )}
                </span>
              </div>

              <Link to="/checkout" className={styles.checkoutButton}>
                Procedi al Checkout
              </Link>

              <Link to="/gallery" className={styles.continueShoppingButton}>
                Continua lo Shopping
              </Link>

              <button className={styles.clearCartButton} onClick={() => setIsModalOpen(true)}>
                Svuota Carrello
              </button>

            </div>
          </div>

        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onConfirm={handleClearCart}
        onCancel={() => setIsModalOpen(false)}
        message="Sei sicuro di voler svuotare il carrello?"
      />

    </div>
  );
};

export default Cart;
