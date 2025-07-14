
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useAppContext();


  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.img_url,
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

  return (
    <Link to={`/product/${product.slug}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={product.img_url}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />
        {product.isNew && <span className={styles.badge}>Nuovo</span>}
        {product.onSale && <span className={`${styles.badge} ${styles.saleBadge}`}>Offerta</span>}
        {product.stock === 0 && <span className={`${styles.badge} ${styles.outOfStockBadge}`}>Esaurito</span>}

        <button
          className={`${styles.addToCartButton} ${product.inStock === 0 ? styles.disabled : ''
            }`}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Esaurito' : '🛒'}
        </button>
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.category}>{product.category}</p>

        <div className={styles.priceContainer}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.original_price && (
            <span className={styles.originalPrice}>
              {formatPrice(product.original_price)}
            </span>
          )}
        </div>

        <div className={styles.stock}>
          {product.stock > 0 ? (
            <span className={styles.inStock}>
              {product.stock < 5 ? `Solo ${product.stock} rimasti` : 'Disponibile'}
            </span>
          ) : (
            <span className={styles.outOfStock}>Non disponibile</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

