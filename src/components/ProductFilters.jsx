import { useAppContext } from '../context/AppContext';
import styles from './ProductFilters.module.css';

const ProductFilter = () => {
  const { viewMode, sortBy, setViewMode, setSortBy } = useAppContext();

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className={styles.filters}>
      <div className={styles.viewModeToggle}>
        <button
          className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
          onClick={() => handleViewModeChange('grid')}
          title="Vista Griglia"
        >
          ⊞
        </button>
        <button
          className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
          onClick={() => handleViewModeChange('list')}
          title="Vista Lista"
        >
          ☰
        </button>
      </div>

      <div className={styles.sortContainer}>
        <label htmlFor="sortSelect" className={styles.sortLabel}>
          Ordina per:
        </label>
        <select
          id="sortSelect"
          value={sortBy}
          onChange={handleSortChange}
          className={styles.sortSelect}
        >
          <option value="newest">Più recenti</option>
          <option value="name">Nome A-Z</option>
          <option value="price-asc">Prezzo crescente</option>
          <option value="price-desc">Prezzo decrescente</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilter;
