
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const { addToCart, cart } = useAppContext();




  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) return;


    const cartItem = cart.find(item => item.slug === product.slug);
    const currentQuantity = cartItem ? cartItem.quantity : 0;


    if (currentQuantity >= product.stock) {
      alert(`Hai già aggiunto tutte le ${product.stock} unità disponibili di "${product.name}" al carrello.`);
      return;
    }

    // if (product.stock < cartProd.maxStock) {
    addToCart({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.img_url,
      quantity: 1,
      maxStock: product.stock

    });



    // } else {
    //   console.log("non aggiungibile")
    // }



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


        {product.status === 1 && <span className={styles.badge}>Nuovo</span>}
        {product.discount && <span className={`${styles.badge} ${styles.saleBadge}`}>Offerta {product.discount}%</span>}
        {product.stock === 0 && <span className={`${styles.badge} ${styles.outOfStockBadge}`}>Esaurito</span>}

        <button
          className={`${styles.addToCartButton} ${product.stock === 0 ? styles.disabled : ''}`}
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
          <span className={styles.price}>{formatPrice(product.price - (product.price * product.discount / 100))}</span>
          {product.discount && (
            <span className={styles.originalPrice}>
              {formatPrice(product.price)}
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

