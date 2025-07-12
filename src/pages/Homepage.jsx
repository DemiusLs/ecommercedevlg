import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import WelcomePopup from "../components/WelcomePopup"
import ProductCarousel from "../components/ProductCarousel"
import axios from "axios";
import styles from './Homepage.module.css';
import Gallery from "./Gallery";


const Homepage = () => {
  const { dispatch, shoWelcomePopup, products } = useAppContext();
  const [heroSlide, setHeroSlide] = useState(0)


  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=800&fit=crop&crop=center",
      title: "Arte che Trasforma",
      subtitle: "Scopri la nostra collezione esclusiva di stampe d'arte 45x75 cm"
    },
    {
      image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200&h=800&fit=crop&crop=center",
      title: "Qualità Premium",
      subtitle: "Stampe di alta qualità su carta professionale"
    },
    {
      image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1200&h=800&fit=crop&crop=center",
      title: "Design Unico",
      subtitle: "Ogni pezzo è selezionato per la sua unicità e bellezza"
    }
  ];

  useEffect(() => {
    axios.get('http://localhost:3001/prints')
      .then(res => {
        dispatch({ type: 'SET_PRODUCTS', payload: res.data })
      })
      .catch(error => {
        console.error("Errore nel caricamento dei prodotti:", error);
      })

    const interval = setInterval(() => {
      setHeroSlide(prev => (prev + 1) & heroSlides.length)
    }, 5000)

    return () => clearInterval(interval);
  }, [dispatch])

  const newProducts = products.filter(p => p.isNew);
  const saleProducts = products.filter(p => p.onSale);
  const featuredProducts = products.filter(p => p.isFeatured);

  return (
    <div className={styles.homepage}>
      {/* Welcome popup */}


      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroSlider}>
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`${styles.heroSlide} ${index === heroSlide ? styles.heroSlideActive : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>{slide.title}</h1>
                <p className={styles.heroSubtitle}>{slide.subtitle}</p>
                <Link to="/gallery" className={styles.heroCta}>Esplora la Collezione</Link>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.heroIndicators}>
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`${styles.heroIndicator} ${index === heroSlide ? styles.heroIndicatorActive : ''}`}
              onClick={() => setHeroSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Banner*/}

      <section className={styles.banner}>
        <div className={styles.bannerContent}>
          <span className={styles.bannerIcon}>🚚</span>
          <span className={styles.bannerText}>Spedizione gratuita per ordini superiori a 75€</span>
        </div>
      </section>

      {/* Carousels */}
      <section className={styles.carousel}>
        <div className={styles.container}>
          {newProducts.length > 0 && (
            <ProductCarousel
              title="Nuovi Arrivi"
              products={newProducts}
              viewAllLink="/gallery?filter_new"
            />
          )}

          {saleProducts.length > 0 && (
            <ProductCarousel
              title="In Offerta"
              products={saleProducts}
              viewAllLink="/gallery?filter=sale"
            />
          )}

          {featuredProducts.length > 0 && (
            <ProductCarousel
              title="Scelti per Te"
              products={featuredProducts}
              viewAllLink="/gallery?filter=featured"
            />
          )}
        </div>
      </section>

    </div>
  );
};

export default Homepage;
