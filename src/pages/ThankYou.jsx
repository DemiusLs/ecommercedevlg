import { Link } from "react-router-dom";
import styles from "./ThankYou.module.css";

const ThankYou = () => {
  return (
    <div className={styles.thankYou}>
      <div className={styles.container}>
        <h1>🎉 Grazie per il tuo ordine!</h1>
        <p>
          Il tuo pagamento è andato a buon fine e abbiamo inviato una conferma all’indirizzo email che hai fornito.
        </p>
        <p>
          Se non ricevi l’email entro pochi minuti, controlla la cartella spam o contattaci.
        </p>
        <Link to="/gallery" className={styles.backButton}>
          Torna alla Galleria
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;
