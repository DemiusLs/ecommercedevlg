import { useState, useEffect } from 'react';

import styles from './WelcomePopup.module.css';

const WelcomePopup = () => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [discountCode, setDiscountCode] = useState("")
  const [copied, setCopied] = useState(false)

  // Funzione per generare codici random

  const generateCode = () => {
    const prefix = "BOOL"
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `${prefix} - ${randomPart}`;
  };

  useEffect(() => {
    const alreadyVisited = localStorage.getItem('boolshop_visited');
    if (!alreadyVisited) {
      setVisible(true);
    }
    //codice sconto /////////////////////////////////////////////////////////
    
    const saveCode = localStorage.getItem("discountCode")
    if (saveCode) {
      setDiscountCode(saveCode)
    } else {
      const newCode = generateCode()
      setDiscountCode(newCode)
      localStorage.getItem("discountCode", newCode)
    }

  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(discountCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  };

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem('boolshop_visited', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await newsletterAPI.subscribe(email);
      setMessage("Grazie! Ti abbiamo inviato un'email di benvenuto.");
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      setMessage("Errore durante l'iscrizione. Riprova più tardi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!visible) return null;


  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={handleClose}>
          ✕
        </button>

        <div className={styles.content}>
          <h2 className={styles.title}>Benvenuto in BoolShop!</h2>
          <p className={styles.subtitle}>
            Iscriviti alla nostra newsletter per non perderti i nuovi arrivi e il buono sconto del 10%
          </p>

          <div className={styles.discountBoxe}>
            <span className={styles.code}>{discountCode}</span>
            <button onClick={handleCopy} className={styles.copyButton}>
              {copied ? "✅ Copiato!" : "Copia"}
            </button>
          </div>
          <p>Usa questo codice al checkout per ricevere lo sconto.</p>

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
            <p className={`${styles.message} ${message.includes('Grazie') ? styles.success : styles.error
              }`}>
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
