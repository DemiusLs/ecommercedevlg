import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext'; 
import styles from './ProductCard.module.css';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useRef } from 'react'; // Importa useRef
import TooltipPortal from './TooltipPortal'; 

const ProductCard = ({ product, showWishlistButton = true, viewMode = 'grid' }) => {
  const { addToCart, cart, wishlist = [], toggleWishlist, showAlert } = useAppContext();
  const wishlistButtonRef = useRef(null); // Crea un ref per il bottone del cuore

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

  const isProductInWishlist = wishlist.some(item => item.slug === product.slug);

  return (
    <Link to={`/product/${product.slug}`} className={`${styles.card} ${viewMode === 'list' ? styles.cardList : ''}`}>
      {/* Contenitore per l'icona Wishlist - Il tooltip verrà renderizzato separatamente con un Portal */}
      {showWishlistButton && (
        <div className={styles.wishlistIconContainer}>
          <button
            ref={wishlistButtonRef} // Assegna il ref al bottone
            className={styles.wishlistIcon}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);

              if (isProductInWishlist) {
                showAlert(`"${product.name}" rimosso dai preferiti.`, 'error');
              } else {
                showAlert(`"${product.name}" aggiunto ai preferiti!`, 'success');
              }
            }}
          >
            {isProductInWishlist ?
              <FaHeart style={{ color: 'red' }} />
              :
              <FaRegHeart />
            }
          </button>
          {/* ✨ Renderizza il tooltip tramite il Portal, passando il ref al bottone del cuore */}
          <TooltipPortal targetRef={wishlistButtonRef}>
            {isProductInWishlist ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
          </TooltipPortal>
        </div>
      )}

      <div className={styles.imageContainer}>
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