import { useEffect } from 'react';
import styles from './Alert.module.css';

const Alert = ({ message, visible, duration = 2500, onClose, type = 'success' }) => {
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`${styles.alert} ${styles[type]} ${styles.show}`}>
      {message}
    </div>
  );
};

export default Alert;

