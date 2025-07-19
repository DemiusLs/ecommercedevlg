
import { useEffect } from 'react';
import styles from './PopupAdd.module.css';

const popupAdd = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`${styles.popupAdd} ${styles[type]}`}>
      {message}
    </div>
  );
};

export default popupAdd;
