import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AppHeader.module.css';
import { useAppContext } from '../../context/AppContext';
// import mediaquery from './AppHeadermediaquery.module.css'

const AppHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cart } = useAppContext();
  const navigate = useNavigate();
  const { compareList } = useAppContext();

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // navigate(`/search?q=${searchQuery.trim()}`);  //nella parte interna al navigate si inserisce la chaiamta api
      navigate(`/gallery?q=${searchQuery.trim()}`);
    }
  };

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Chi siamo', path: '/about' },
    { name: 'Galleria Stampe', path: '/gallery' },
    { name: 'Contatti', path: '/contact' },
    { name: 'Confronta Prodotti', path: '/compare' }

  ];

  return (

    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img src="/logo-header-1.png" alt="" className={styles.logoImage} />
        </Link>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={styles.navLink}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              placeholder="Cerca stampe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              🔍
            </button>
          </form>

          <Link to="/wishlist" className={styles.wishlistButton}>
            ❤️
          </Link>

          <Link to="/cart" className={styles.cartButton}>
            🛒
            {cartItemsCount > 0 && (
              <span className={styles.cartBadge}>{cartItemsCount}</span>
            )}
          </Link>

          <button
            className={styles.menuToggle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
