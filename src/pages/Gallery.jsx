
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import styles from './Gallery.module.css';

const Gallery = () => {
  const { viewMode, sortBy, products: productsFromContext = [] } = useAppContext();


  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]);

  const filter = searchParams.get('filter');
  const query = searchParams.get('q');

  useEffect(() => {
    if (!Array.isArray(productsFromContext)) return;
    
    let products = [...productsFromContext];


    // // Apply filters
    // if (filter === 'new') {
    //   products = products.filter(p => p.isNew);
    // } else if (filter === 'sale') {
    //   products = products.filter(p => p.onSale);
    // } else if (filter === 'featured') {
    //   products = products.filter(p => p.isFeatured);
    // }

    // Apply search
    if (query) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        products.sort((a, b) => b.id - a.id);
        break;
    }

    setFilteredProducts(products);
  }, [filter, query, sortBy, productsFromContext]);

  const getPageTitle = () => {
    if (query) return `Risultati per "${query}"`;
    if (filter === 'new') return 'Nuovi Arrivi';
    if (filter === 'sale') return 'In Offerta';
    if (filter === 'featured') return 'Scelti per Te';
    return 'Galleria Stampe';
  };

  return (
    <div className={styles.gallery}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{getPageTitle()}</h1>
          <p className={styles.subtitle}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'prodotto' : 'prodotti'}
          </p>
        </div>

        <ProductFilters />

        <div className={styles.content}>
          <div className={`${styles.grid} ${viewMode === 'list' ? styles.listView : styles.gridView
            }`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🎨</div>
              <h3 className={styles.emptyTitle}>Nessun prodotto trovato</h3>
              <p className={styles.emptyDescription}>
                Prova a modificare i filtri di ricerca o esplora la nostra collezione completa.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;

