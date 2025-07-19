import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import styles from './ProductDetail.module.css';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FaBalanceScale } from 'react-icons/fa';
import ProductCarousel from '../components/ProductCarousel';
import fetchFilteredPrints from '../services/filterPrints.js';
import axios from 'axios';
import TooltipPortal from '../components/TooltipPortal.jsx';


const ProductDetail = () => {

  const { slug } = useParams();
  const { addToCart,
    cart,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    compareList,
    addToCompare,
    removeFromCompare,
    showAlert } = useAppContext()

  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [compareAlert, setCompareAlert] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  //ref per il bottone della wishlist
  const wishlistButtonRef = useRef(null);


  const isWishlisted = product && wishlist.some(item => item.slug === product.slug);
  const isInCompareList = product && compareList?.some(item => item.slug === product.slug);

  //logo per aggiunta o rimozione dalla wishlist
  const toggleWishlist = () => {
    if (!product) return;  // evita errori se product non è ancora caricato

    if (isWishlisted) {
      removeFromWishlist(product.slug);
    } else {
      addToWishlist(product);
    }
  };
  // logo per inserire in comparazione prodotto
  const handleCompare = () => {
    if (!product) return;

    if (isInCompareList) {
      removeFromCompare(product.slug);
    } else {
      if (compareList?.length >= 3) {
        showAlert("Puoi confrontare al massimo 3 prodotti.", `error`);
        return;
      }
      addToCompare(product);
      setCompareAlert(true);
      setTimeout(() => setCompareAlert(false), 2000); // alert visibile per 2s
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/prints/${slug}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Errore nel recupero del prodotto:', err);
        setProduct(null); // forza la schermata "Prodotto non trovato"
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    const loadRelatedProducts = async () => {
      if (!product?.genre_name) return;

      try {
        const { data } = await fetchFilteredPrints({
          genre: product.genre_name,
          // limit: 8
        });

        const filtered = data.filter(p => p.slug !== product.slug);
        setRelatedProducts(filtered);
      } catch (err) {
        console.error('Errore nel caricamento dei prodotti correlati:', err);
      }
    };

    loadRelatedProducts();
  }, [product]);

  if (isLoading) {
    return <div className={styles.loading}>Caricamento...</div>;
  }


  if (!product) {
    return (
      <div className={styles.notFound}>
        <h2>Prodotto non trovato</h2>
        <button onClick={() => navigate('/gallery')} className={styles.backButton}>
          Torna alla galleria
        </button>
      </div>
    );
  }


  const handleAddToCart = (e) => {

    // if (product.stock === 0 || product.stock - product.quantity === 0) return;
    e.stopPropagation();
    const cartItem = cart.find(item => item.slug === product.slug);
    const alreadyInCart = cartItem ? cartItem.quantity : 0;


    // somma di già presenti + quelli che vuoi aggiungere
    const totalRequested = alreadyInCart + quantity;


    if (totalRequested > product.stock) {
      showAlert(`Hai già aggiunto tutte le ${product.stock} unità di "${product.name}" al carrello.`, 'error');
      return;
    }

    addToCart({
      ...product,
      quantity,
    });

    showAlert(`${product.name} aggiunto al carrello!`);
  };



  /**
   * Description placeholder
   *gestisce la la variazione della quantita
   * @param {*} newQuantity 
   */
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  // Mock additional images for the gallery
  const productImages = [
    product.img_url,
    product.img_url, // In a real app, these would be different images
    product.img_url
  ];


  console.log(product)

  return (
    <div className={styles.productDetail}>
      {compareAlert && (
        <div className={styles.compareAlert}>
          Prodotto aggiunto alla comparazione!
        </div>
      )}
      <div className={styles.container}>
        <button onClick={() => navigate(-1)} className={styles.backLink}>
          ← Indietro
        </button>

        <div className={styles.productGrid}>
          <div className={styles.imageSection}>
            <div className={styles.mainImage}>
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className={styles.productImage}
              />
              {product.status === 1 && <span className={styles.badge}>Nuovo</span>}
              {product.discount && <span className={`${styles.badge} ${styles.saleBadge}`}>Offerta</span>}
              {product.stock === 0 && <span className={`${styles.badge} ${styles.outOfStockBadge}`}>Esaurito</span>}
            </div>

            <div className={styles.imageGallery}>
              {productImages.map((image, index) => (
                <button
                  key={index}
                  className={`${styles.thumbnailButton} ${index === selectedImage ? styles.activeThumbnail : ''
                    }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.productInfo}>
            <div className={styles.breadcrumb}>
              <span className={styles.category}>{product.category}</span>
            </div>

            <h1 className={styles.productName}>{product.name}
              <button ref={wishlistButtonRef} className={styles.wishlistButton} onClick={toggleWishlist}>
                {isWishlisted ? (
                  <FaHeart className={styles.heartIconFilled} />
                ) : (
                  <FaRegHeart className={styles.heartIconEmpty} />
                )}
              </button>
              {/* Tooltip per la wishlist */}
              <TooltipPortal targetRef={wishlistButtonRef}>
                {isWishlisted ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
              </TooltipPortal>
              <button
                className={styles.compareButton}
                onClick={handleCompare}
                title="Confronta"
              >
                <FaBalanceScale />
              </button>

            </h1>
            <p className={styles.productDescription}>{product.description}</p>

            <div className={styles.priceContainer}>
              <span className={styles.price}>
                {formatPrice(product.price - (product.price * product.discount / 100))}
              </span>

              {product.discount > 0 && (
                <>
                  <span className={styles.originalPrice}>
                    {formatPrice(product.price)}
                  </span>
                  <span className={styles.discountBadge}>
                    -{product.discount}%
                  </span>
                </>
              )}
            </div>


            <div className={styles.stockInfo}>
              {product.stock > 0 ? (
                <span className={styles.inStock}>
                  {`Solo ${product.stock} disponibili!`}
                </span>
              ) : (
                <span className={styles.outOfStock}>Non disponibile</span>
              )}
            </div>

            <div className={styles.addToCartSection}>
              <div className={styles.quantitySelector}>
                <label className={styles.quantityLabel}>Quantità:</label>
                <div className={styles.quantityControls}>
                  <button
                    className={styles.quantityButton}
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className={styles.quantityValue}>{quantity}</span>
                  <button
                    className={styles.quantityButton}
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className={`${styles.addToCartButton} ${product.stock === 0 ? styles.disabled : ''
                  }`}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Non disponibile' : 'Aggiungi al carrello'}
              </button>
            </div>

            <div className={styles.productDetails}>
              <h3 className={styles.detailsTitle}>Dettagli prodotto</h3>
              <ul className={styles.detailsList}>
                <li><strong>Dimensioni:</strong> 45x75 cm</li>
                <li><strong>Materiale:</strong> Carta fotografica premium</li>
                <li><strong>Stampa:</strong> Alta qualità, resistente ai raggi UV</li>
                <li><strong>Spedizione:</strong> 2-3 giorni lavorativi</li>
              </ul>
            </div>
          </div>



        </div>
        <div className={styles.boxcarousel}>
        {relatedProducts.length > 0 && (
          <ProductCarousel
            title={`Altri in ${product.genre_name}`}
            products={relatedProducts}
            viewAllLink={`/gallery?genre=${encodeURIComponent(product.genre_name)}`}
          />
        )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
