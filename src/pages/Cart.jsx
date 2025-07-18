import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import styles from './Cart.module.css';

const Cart = () => {
  const { cart, removeFromCart, setCart } = useAppContext();

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
          <div className={styles.cartItems}>
            {cart.map((item) => {
              const discountedPrice = getDiscountedPrice(item);
              const totalItemPrice = discountedPrice * item.quantity;
              return (
                <div key={item.slug} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img src={item.img_url} alt={item.name} />
                  </div>

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

                    {item.quantity > item.maxStock && (
                      <div className={styles.stockWarning}>
                        <span className={styles.warningText}>
                          ⚠️ Solo {item.maxStock} disponibili
                        </span>
                      </div>
                    )}
                  </div>

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

                  <div className={styles.itemTotal}>
                    {formatPrice(totalItemPrice)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.cartSummary}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Riepilogo Ordine</h3>

              <div className={styles.summaryRow}>
                <span>Subtotale</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
