import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {

  const { slug } = useParams();
  const { addToCart, products } = useAppContext()
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const foundProduct = products.find(p => p.slug === slug);
    if (foundProduct) {
      setProduct(foundProduct);
    }
    setIsLoading(false);
  }, [slug]);

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

  const handleAddToCart = () => {
    if (product.stock === 0) return;

    addToCart({
      ...product,
      quantity: quantity,

    });

    // Show success feedback
    alert(`${product.name} aggiunto al carrello!`);
  };

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



  return (
    <div className={styles.productDetail}>
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
              {product.isNew && <span className={styles.badge}>Nuovo</span>}
              {product.onSale && <span className={`${styles.badge} ${styles.saleBadge}`}>Offerta</span>}
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

            <h1 className={styles.productName}>{product.name}</h1>
            <p className={styles.productDescription}>{product.description}</p>

            <div className={styles.priceSection}>
              <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className={styles.originalPrice}>
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.onSale && (
                <span className={styles.discount}>
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            <div className={styles.stockInfo}>
              {product.stock > 0 ? (
                <span className={styles.inStock}>
                  {product.stock < 5 ? `Solo ${product.stock} disponibili!` : 'Disponibile'}
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
      </div>
    </div>
  );
};

export default ProductDetail;
