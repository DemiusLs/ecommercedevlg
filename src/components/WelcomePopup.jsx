import { useState, useEffect } from 'react';
import axios from 'axios';
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
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setMessage("Per favore, inserisci un'email valida.");
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      // Qui effettuiamo la chiamata Axios al tuo backend
      // Ricorda che il proxy nel package.json del frontend gestirà il reindirizzamento
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/email/send-test-email`, {
        recipientEmail: email, // L'email dell'utente
        subject: 'Benvenuto in BoolShop! Il tuo buono sconto del 10% ti aspetta!', // Oggetto dell'email
        messageHtml: `
                    <p>Ciao ${email},</p>
                    <p>Grazie mille per esserti iscritto alla newsletter di BoolShop!</p>
                    <p>Come promesso, ecco il tuo <strong>buono sconto del 10%</strong> sul tuo prossimo acquisto:</p>
                    <h3 style="color: #007bff;">CODICE_SCONTO_10PERCENTO</h3>
                    <p>Speriamo tu possa trovare qualcosa di fantastico!</p>
                    <p>A presto,</p>
                    <p>Il Team di BoolShop</p>
                `, // Contenuto HTML della welcome email
        messageText: `Ciao ${email},\nGrazie mille per esserti iscritto alla newsletter di BoolShop!\nCome promesso, ecco il tuo buono sconto del 10% sul tuo prossimo acquisto: CODICE_SCONTO_10PERCENTO\nSperiamo tu possa trovare qualcosa di fantastico!\nA presto,\nIl Team di BoolShop` // Contenuto testuale di fallback
      });

      // Se la richiesta ha successo, imposta il messaggio di successo
      setMessage("Grazie! Ti abbiamo inviato un'email di benvenuto e il tuo buono sconto.");
      console.log('Risposta backend:', response.data);

      // Chiudi il popup dopo un breve ritardo per far leggere il messaggio
      setTimeout(() => {
        handleClose();
      }, 3000); // Ho aumentato leggermente il tempo per una migliore UX

    } catch (error) {
      // Gestione degli errori dalla chiamata API
      console.error('Errore durante l\'iscrizione alla newsletter:', error);
      if (error.response) {
        // Errore dal backend con un messaggio specifico
        setMessage(`Errore: ${error.response.data.message || "Problema con il server."}`);
      } else if (error.request) {
        // Richiesta inviata ma nessuna risposta (es. backend non attivo, problema di rete)
        setMessage("Errore di rete. Impossibile connettersi al server. Riprova più tardi.");
      } else {
        // Qualcosa è andato storto nella configurazione della richiesta
        setMessage("Si è verificato un errore inaspettato. Riprova.");
      }
    } finally {
      setIsSubmitting(false); // Fine dell'invio
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
