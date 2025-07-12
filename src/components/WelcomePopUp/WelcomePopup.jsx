import React, { useState, useEffect } from 'react';
import { newsletterAPI } from '../services/api';
import styles from './WelcomePopup.module.css';

const WelcomePopup = () => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const alreadyVisited = localStorage.getItem('boolshop_visited');
    if (!alreadyVisited) {
      setVisible(true);
    }
  }, []);

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
            Scopri la nostra collezione di stampe d'arte esclusive
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
            <p className={`${styles.message} ${
              message.includes('Grazie') ? styles.success : styles.error
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
