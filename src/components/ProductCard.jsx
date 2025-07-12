import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const { dispatch } = useAppContext();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.inStock === 0) return;

    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        maxStock: product.inStock
      }
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
        {product.inStock === 0 && <span className={`${styles.badge} ${styles.outOfStockBadge}`}>Esaurito</span>}
        
        <button
          className={`${styles.addToCartButton} ${
            product.inStock === 0 ? styles.disabled : ''
          }`}
          onClick={handleAddToCart}
          disabled={product.inStock === 0}
        >
          {product.inStock === 0 ? 'Esaurito' : 'Aggiungi al carrello'}
        </button>
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.category}>{product.category}</p>
        
        <div className={styles.priceContainer}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className={styles.originalPrice}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <div className={styles.stock}>
          {product.inStock > 0 ? (
            <span className={styles.inStock}>
              {product.inStock < 5 ? `Solo ${product.inStock} rimasti` : 'Disponibile'}
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

