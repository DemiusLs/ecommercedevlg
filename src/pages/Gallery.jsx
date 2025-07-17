import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import styles from './Gallery.module.css';
import fetchFilteredPrints from '../services/filterPrints';
const Gallery = () => {
  const { viewMode, sortBy, products: productsFromContext = [] } = useAppContext();

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [pagedProducts, setPagedProducts] = useState([])
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]);

  const filter = searchParams.get('filter');
  const query = searchParams.get('q');

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchFilteredPrints({
        filter,
        genre: null, // o da URL se presente
        query,
        sort: sortBy.replace('-', '_'), // 'price-asc' → 'price_asc'
        page,
        limit
      });

      setFilteredProducts(result.data || []);
      setPagedProducts(result.data || []);
      setTotalPages(result.totalPages || 1);
    };

    fetchData();
  }, [filter, query, sortBy, page, limit]);

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
        <div className={styles.controls}>
          <label>Prodotti per pagina: </label>
          <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1) }}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>


        <div className={styles.content}>
          <div className={`${styles.grid} ${viewMode === 'list' ? styles.listView : styles.gridView}`}>
            {pagedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />

            ))}
          </div>

          {pagedProducts.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🎨</div>
              <h3 className={styles.emptyTitle}>Nessun prodotto trovato</h3>
              <p className={styles.emptyDescription}>
                Prova a modificare i filtri di ricerca o esplora la nostra collezione completa.
              </p>
            </div>
          )}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>⬅️</button>
              <span>Pagina {page} di {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>➡️</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
