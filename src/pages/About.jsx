
import React from 'react';
import styles from './About.module.css';

const About = () => {
  return (
    <div className={styles.about}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Chi Siamo</h1>
          <p className={styles.subtitle}>
            BoolShop nasce dalla passione per l'arte e dal desiderio di rendere accessibili 
            opere d'arte di qualità per trasformare ogni spazio in un ambiente unico.
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <div className={styles.textContent}>
              <h2 className={styles.sectionTitle}>La Nostra Storia</h2>
              <p className={styles.text}>
                Fondata nel 2024, BoolShop è nata dall'idea di democratizzare l'accesso all'arte. 
                Crediamo che ogni spazio meriti di essere arricchito da opere d'arte di qualità, 
                indipendentemente dal budget o dalla conoscenza artistica.
              </p>
              <p className={styles.text}>
                La nostra cura nella selezione delle opere e l'attenzione ai dettagli nella 
                produzione ci hanno permesso di diventare un punto di riferimento per chi cerca 
                stampe d'arte di alta qualità nel formato 45x75 cm.
              </p>
            </div>
            <div className={styles.imageContent}>
              <img 
                src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop&crop=center" 
                alt="La nostra galleria" 
                className={styles.sectionImage}
              />
            </div>
          </div>

          <div className={`${styles.section} ${styles.reverse}`}>
            <div className={styles.imageContent}>
              <img 
                src="https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=600&h=400&fit=crop&crop=center" 
                alt="Qualità dei nostri prodotti" 
                className={styles.sectionImage}
              />
            </div>
            <div className={styles.textContent}>
              <h2 className={styles.sectionTitle}>Qualità e Sostenibilità</h2>
              <p className={styles.text}>
                Utilizziamo esclusivamente carte fotografiche premium e inchiostri resistenti 
                ai raggi UV per garantire che ogni stampa mantenga i suoi colori vividi nel tempo. 
                Il formato 45x75 cm è stato scelto per offrire il perfetto equilibrio tra impatto 
                visivo e versatilità d'arredo.
              </p>
              <p className={styles.text}>
                Siamo impegnati in pratiche sostenibili: le nostre stampe sono prodotte su 
                richiesta per ridurre gli sprechi e utilizziamo imballaggi eco-friendly per 
                le spedizioni.
              </p>
            </div>
          </div>

          <div className={styles.valuesSection}>
            <h2 className={styles.centerTitle}>I Nostri Valori</h2>
            <div className={styles.valuesGrid}>
              <div className={styles.value}>
                <div className={styles.valueIcon}>🎨</div>
                <h3 className={styles.valueTitle}>Arte per Tutti</h3>
                <p className={styles.valueText}>
                  Crediamo che l'arte debba essere accessibile a tutti, 
                  indipendentemente dal background o dal budget.
                </p>
              </div>
              <div className={styles.value}>
                <div className={styles.valueIcon}>⭐</div>
                <h3 className={styles.valueTitle}>Qualità Superiore</h3>
                <p className={styles.valueText}>
                  Non scendiamo mai a compromessi sulla qualità dei materiali 
                  e dei processi di stampa.
                </p>
              </div>
              <div className={styles.value}>
                <div className={styles.valueIcon}>🌱</div>
                <h3 className={styles.valueTitle}>Sostenibilità</h3>
                <p className={styles.valueText}>
                  Produciamo su richiesta e utilizziamo materiali eco-friendly 
                  per ridurre l'impatto ambientale.
                </p>
              </div>
              <div className={styles.value}>
                <div className={styles.valueIcon}>💝</div>
                <h3 className={styles.valueTitle}>Servizio Clienti</h3>
                <p className={styles.valueText}>
                  Il tuo soddisfacimento è la nostra priorità. 
                  Siamo qui per aiutarti in ogni fase del tuo acquisto.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.teamSection}>
            <h2 className={styles.centerTitle}>Il Nostro Team</h2>
            <p className={styles.teamDescription}>
              Un gruppo di appassionati d'arte, designer e esperti di stampa che lavorano 
              insieme per offrirti la migliore esperienza possibile.
            </p>
            <div className={styles.teamGrid}>
              <div className={styles.teamMember}>
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612d4c0?w=300&h=300&fit=crop&crop=face" 
                  alt="Giovanni Garlaschini co-founder" 
                  className={styles.memberImage}
                />
                <h3 className={styles.memberName}>Giovanni Garlaschini</h3>
                <p className={styles.memberRole}>Web Developer</p>
              </div>
              <div className={styles.teamMember}>
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face" 
                  alt="Luca Orabona co-founder" 
                  className={styles.memberImage}
                />
                <h3 className={styles.memberName}>Luca Orabona</h3>
                <p className={styles.memberRole}>Web Developer</p>
              </div>
              <div className={styles.teamMember}>
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face" 
                  alt="Damiano Loss co-founder" 
                  className={styles.memberImage}
                />
                <h3 className={styles.memberName}>Damiano Loss</h3>
                <p className={styles.memberRole}>Web Developer</p>
              </div>
              <div className={styles.teamMember}>
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face" 
                  alt="Virgilio Defeo - co-founder" 
                  className={styles.memberImage}
                />
                <h3 className={styles.memberName}>Virgilio Defeo</h3>
                <p className={styles.memberRole}>Web Developer</p>
              </div>
              <div className={styles.teamMember}>
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face" 
                  alt="Emanuele Annoscia - co-founder" 
                  className={styles.memberImage}
                />
                <h3 className={styles.memberName}>Emanuele Annoscia</h3>
                <p className={styles.memberRole}>Web Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;