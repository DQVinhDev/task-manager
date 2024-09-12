import React from 'react';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <button 
      className={`${styles.themeToggle} ${isDarkMode ? styles.dark : styles.light}`} 
      onClick={toggleTheme}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className={styles.toggleThumb}></div>
    </button>
  );
};

export default ThemeToggle;