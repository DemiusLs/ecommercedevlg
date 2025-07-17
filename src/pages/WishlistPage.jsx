import React from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import styles from './WishlistPage.module.css';

const Wishlist = () => {
  const { wishlist } = useAppContext();

  return (
    <div className={styles.wishlist}>
      <div className={styles.container}>
        <h1 className={styles.title}>La tua Wishlist</h1>
        {wishlist.length === 0 ? (
          <p className={styles.empty}>Nessun prodotto nella wishlist.</p>
        ) : (
          <div className={styles.grid}>
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} showWishlistButton={false} />

            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
