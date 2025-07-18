import { useAppContext } from '../context/AppContext';
import { FaTrash } from 'react-icons/fa';
import styles from './compare.module.css';

const Compare = () => {
    const { compareList, removeFromCompare } = useAppContext();

    if (compareList.length === 0) {
        return <div className={styles.noCompare}>Nessun prodotto da confrontare.</div>;
    }

    return (
        <div className={styles.container}>
            <h2>Confronta Prodotti</h2>
            <table>
                <thead>
                    <tr>
                        <th>Caratteristica</th>
                        {compareList.map(product => (
                            <th key={product.slug} className={styles.productHeader}>
                                <div className={styles.imageContainer}>
                                    <img src={product.img_url} alt={product.name} className={styles.productImage} />
                                    <button
                                        onClick={() => removeFromCompare(product.slug)}
                                        className={styles.removeButton}
                                        aria-label={`Rimuovi ${product.name} dal confronto`}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                                <div className={styles.productName}>{product.name}</div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Prezzo</td>
                        {compareList.map(p => <td key={p.slug}>{p.price} €</td>)}
                    </tr>
                    <tr>
                        <td>Categoria</td>
                        {compareList.map(p => <td key={p.slug}>{p.category}</td>)}
                    </tr>
                    <tr>
                        <td>Disponibilità</td>
                        {compareList.map(p => <td key={p.slug}>{p.stock > 0 ? 'Disponibile' : 'Esaurito'}</td>)}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Compare;
