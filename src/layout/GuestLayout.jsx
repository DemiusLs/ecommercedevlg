
import React from 'react';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import styles from './GuestLayout.module.css';

const GuestLayout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <AppHeader />
      <main className={styles.main}>
        {children}
      </main>
      <AppFooter />
    </div>
  );
};

export default GuestLayout;
