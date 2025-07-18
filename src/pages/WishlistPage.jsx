import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import styles from './WishlistPage.module.css';
import ConfirmModal from '../pages/ConfirmModal';


const Wishlist = () => {
  const { wishlist, clearWishlist } = useAppContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClear = () => {
    clearWishlist();
    setShowModal(false);
  };

  return (
    <div className={styles.wishlist}>
      <div className={styles.container}>
        <h1 className={styles.title}>La tua Wishlist</h1>
        <div className={styles.header}>
          <h1 className={styles.title}>La tua Wishlist</h1>
          {wishlist.length > 0 && (
            <button className={styles.clearButton} onClick={() => setShowModal(true)}>
              Svuota Wishlist
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <p className={styles.empty}>Nessun prodotto nella wishlist.</p>
        ) : (
          <>
            <div className={styles.grid}>
              {wishlist.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showWishlistButton={false}
                />
              ))}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className={styles.clearWishlistButton}
            >
              Svuota Wishlist
            </button>
          </>
          <div className={styles.grid}>
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <p>Sei sicuro di voler svuotare la wishlist?</p>
              <div className={styles.modalButtons}>
                <button onClick={handleClear} className={styles.confirm}>
                  Sì, svuota
                </button>
                <button onClick={() => setShowModal(false)} className={styles.cancel}>
                  Annulla
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modale di conferma */}
      <ConfirmModal
       isOpen={isModalOpen}
  onConfirm={handleClearCart}
  onCancel={() => setIsModalOpen(false)}
  message="Sei sicuro di voler svuotare il carrello?"
      />
    </div>
  );
};

export default Wishlist;
