import { useEffect } from "react";
import style from "./NotFound.module.css";

const NotFound = () => {
  useEffect(() => {
    console.error("404 Error: Page not found");
  }, []);

  return (
    <div className={style.notFound}>
      <div className={style.container}>
        <div className={style.content}>
          <div className={style.errorCode}>404</div>
          <h1 className={style.title}>Oops! Page not found</h1>
          <p className={style.description}>
            La pagina che stai cercando non esiste o è stata spostata.
          </p>
          <div className={style.actions}>
            <a href="/" className={style.homeButton}>
              Ritorna alla Home
            </a>
            <a href="/gallery" className={style.galleryButton}>
              Vai alla galleria
            </a>
          </div>
          <div className={style.suggestions}>
            <div className={style.suggestionsTitle}>Puoi cercare:</div>
            <ul className={style.suggestionsList}>
              <li><a href="/search">Cerca altri contenuti</a></li>
              <li><a href="/contact">Contattare il supporto</a></li>
            </ul>
          </div>
        </div>

        <div className={style.illustration}>
          <div className={style.frame}>
            <div className={style.frameContent}>
              <span className={style.frameIcon}>📷</span>
              <p className={style.frameText}>Lost in space?</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
