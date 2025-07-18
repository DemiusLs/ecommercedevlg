import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './WelcomePopup.module.css';

const WelcomePopup = () => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Funzione per generare un codice sconto casuale
  const generateCode = () => {
    const prefix = "BOOL";
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${randomPart}`;
  };

  useEffect(() => {
    const alreadyVisited = localStorage.getItem('boolshop_visited');
    if (!alreadyVisited) {
      setVisible(true);
    }

    // Genera e imposta un codice sconto
    const newCode = generateCode();
    setDiscountCode(newCode);
  }, []);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem('boolshop_visited', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validazione email semplice
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setMessage("Per favore, inserisci un'email valida.");
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/email/send-test-email`, {
        recipientEmail: email,
        subject: 'Benvenuto in BoolShop! Il tuo buono sconto del 10% ti aspetta!',
        messageHtml: `
          <p>Ciao ${email},</p>
          <p>Grazie mille per esserti iscritto alla newsletter di BoolShop!</p>
          <p>Come promesso, ecco il tuo <strong>buono sconto del 10%</strong> sul tuo prossimo acquisto:</p>
          <h3 style="color: #007BFF;">${discountCode}</h3>
          <p>Speriamo tu possa trovare qualcosa di fantastico!</p>
          <p>A presto,</p>
          <p>Il Team di BoolShop</p>
        `,
        messageText: `Ciao ${email},\nGrazie mille per esserti iscritto alla newsletter di BoolShop!\nCome promesso, ecco il tuo buono sconto del 10% sul tuo prossimo acquisto: ${discountCode}\nSperiamo tu possa trovare qualcosa di fantastico!\nA presto,\nIl Team di BoolShop`
      });

      setMessage("Grazie! Ti abbiamo inviato un'email di benvenuto e il tuo buono sconto.");
      console.log('Risposta backend:', response.data);

      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      console.error("Errore durante l'iscrizione alla newsletter:", error);

      if (error.response) {
        setMessage(`Errore: ${error.response.data.message || "Problema con il server."}`);
      } else if (error.request) {
        setMessage("Errore di rete. Impossibile connettersi al server. Riprova più tardi.");
      } else {
        setMessage("Si è verificato un errore inaspettato. Riprova.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={handleClose}>✕</button>

        <div className={styles.content}>
          <h2 className={styles.title}>Benvenuto in BoolShop!</h2>
          <p className={styles.subtitle}>
            Iscriviti alla nostra newsletter per non perderti i nuovi arrivi e il buono sconto del 10%
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="La tua email per ricevere offerte esclusive"
              className={styles.input}
              required
            />
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Invio...' : 'Iscriviti ora'}
            </button>
          </form>

          {message && (
            <p className={`${styles.message} ${message.includes('Grazie') ? styles.success : styles.error}`}>
              {message}
            </p>
          )}

          <p className={styles.skip} onClick={handleClose}>
            Continua senza iscriverti
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
