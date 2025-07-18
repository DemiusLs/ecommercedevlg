import { useState } from "react";
import styles from "./Contact.module.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Messaggio inviato!");
  };

  return (
    <section className={styles.contact}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Contattaci</h1>
          <p className={styles.subtitle}>
            Siamo qui per aiutarti. Non esitare a contattarci per qualsiasi domanda sui nostri prodotti o sui tuoi ordini.
          </p>
        </div>

        <div className={styles.contactGrid}>
          {/* Info Section */}
          <div className={styles.contactInfo}>
            <div className={styles.infoSection}>
              <h2 className={styles.infoTitle}>Come raggiungerci</h2>

              <div className={styles.contactMethod}>
                <div className={styles.methodIcon}>📧</div>
                <div className={styles.methodContent}>
                  <div className={styles.methodTitle}>Email</div>
                  <div className={styles.methodText}>info@boolshop.it</div>
                  <div className={styles.methodDescription}>Risposta entro 24 ore</div>
                </div>
              </div>

              <div className={styles.contactMethod}>
                <div className={styles.methodIcon}>📞</div>
                <div className={styles.methodContent}>
                  <div className={styles.methodTitle}>Telefono</div>
                  <div className={styles.methodText}>+39 02 1234 5678</div>
                  <div className={styles.methodDescription}>Lun-Ven 9:00-18:00</div>
                </div>
              </div>

              <div className={styles.contactMethod}>
                <div className={styles.methodIcon}>💬</div>
                <div className={styles.methodContent}>
                  <div className={styles.methodTitle}>Chat Live</div>
                  <div className={styles.methodText}>Assistenza in tempo reale</div>
                  <div className={styles.methodDescription}>Lun-Ven 9:00-18:00</div>
                </div>
              </div>

              <div className={styles.contactMethod}>
                <div className={styles.methodIcon}>📍</div>
                <div className={styles.methodContent}>
                  <div className={styles.methodTitle}>Sede</div>
                  <div className={styles.methodText}>Via dell’Arte, 123</div>
                  <div className={styles.methodDescription}>20121 Milano, Italia</div>
                </div>
              </div>
            </div>

            <div className={styles.faqSection}>
              <h2 className={styles.faqTitle}>Domande Frequenti</h2>
              <div className={styles.faqList}>
                <div className={styles.faqItem}>
                  <div className={styles.faqQuestion}>Quanto tempo richiede la spedizione?</div>
                  <div className={styles.faqAnswer}>Le spedizioni richiedono 2-3 giorni lavorativi in tutta Italia.</div>
                </div>
                <div className={styles.faqItem}>
                  <div className={styles.faqQuestion}>Posso restituire un prodotto?</div>
                  <div className={styles.faqAnswer}>Sì, puoi restituire i prodotti entro 30 giorni dall’acquisto.</div>
                </div>
                <div className={styles.faqItem}>
                  <div className={styles.faqQuestion}>Le stampe sono resistenti?</div>
                  <div className={styles.faqAnswer}>Sì, le nostre stampe sono resistenti ai raggi UV e di lunga durata.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className={styles.contactForm}>
            <div className={styles.formCard}>
              <h2 className={styles.formTitle}>Invia un messaggio</h2>

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Il tuo nome"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="email"
                    name="email"
                    placeholder="La tua email"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <select
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Seleziona un argomento</option>
                    <option value="ordine">Ordine</option>
                    <option value="spedizione">Spedizione</option>
                    <option value="resi">Resi</option>
                    <option value="altro">Altro</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <textarea
                    name="message"
                    placeholder="Il tuo messaggio"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={styles.textarea}
                    required
                  ></textarea>
                </div>

                <button type="submit" className={styles.submitButton}>
                  Invia Messaggio
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* (Opzionale) Mappa */}
        <div className={styles.mapSection}>
          <h2 className={styles.mapTitle}>Dove siamo</h2>
          <div className={styles.mapPlaceholder}>
            <div className={styles.mapContent}>
              <div className={styles.mapIcon}>🗺️</div>
              <div className={styles.mapText}>BoolShop Art Prints</div>
              <p className={styles.mapDescription}>Milano, Italia - ci trovi in Via dell’Arte 123</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
