
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import styles from './ProductCard.module.css';

const ProductCard = ({ product, showWishlistButton = true, viewMode = 'grid' }) => {
  const { addToCart, cart, wishlist = [], toggleWishlist, showAlert } = useAppContext();


  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();


    if (product.stock === 0) return;


    const cartItem = cart.find(item => item.slug === product.slug);
    const currentQuantity = cartItem ? cartItem.quantity : 0;


    if (currentQuantity >= product.stock) {
      showAlert(`Hai già aggiunto tutte le ${product.stock} unità di "${product.name}" al carrello.`, 'error');

      return;
    }

    // if (product.stock < cartProd.maxStock) {
    addToCart({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.img_url,
      discount: product.discount,
      quantity: 1,
      maxStock: product.stock

    });


  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const isInWishlist = wishlist.some(item => item.id === product.id);


  return (
    <Link to={`/product/${product.slug}`} className={`${styles.card} ${viewMode === 'list' ? styles.cardList : ''}`}>
      <div className={styles.imageContainer}>
        {showWishlistButton && (
          <button
            className={styles.wishlistIcon}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);

              if (wishlist.some(item => item.slug === product.slug)) {
                showAlert(`"${product.name}" rimosso dai preferiti.`, 'error');
              } else {
                showAlert(`"${product.name}" aggiunto ai preferiti!`, 'success');
              }
            }}
          >
            {wishlist.some(item => item.slug === product.slug) ? '❤️' : '🤍'}
          </button>
        )}

        <img
          src={product.img_url}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />

        {product.status === 1 && <span className={styles.badge}>Nuovo</span>}
        {product.discount && product.status !== 1 && (
          <span className={`${styles.badge} ${styles.saleBadge}`}>
            {product.discount}%
          </span>
        )}

        {product.stock === 0 && (
          <span className={`${styles.badge} ${styles.outOfStockBadge}`}>
            Esaurito
          </span>
        )}
      </div>


      <div className={styles.content}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.category}>{product.category}</p>

        <div className={styles.priceContainer}>
          <span className={styles.price}>{formatPrice(product.price - (product.price * product.discount / 100))}</span>
          {product.discount && (
            <span className={styles.originalPrice}>
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        <div className={styles.priceContainer}>
          {viewMode === "list" && <span className={styles.name}>{product.description}</span>}
        </div>

        <div className={styles.stock}>
          <span className={product.stock > 0 ? styles.inStock : styles.outOfStock}>
            {product.stock > 0
              ? product.stock < 5
                ? `Solo ${product.stock} rimasti`
                : 'Disponibile'
              : 'Non disponibile'}
          </span>
          <button
            className={`${styles.addToCartButton} ${product.stock === 0 ? styles.disabled : ''}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Esaurito' : '🛒'}
          </button>
        </div>

      </div>
    </Link>
  );
};

export default ProductCard;

