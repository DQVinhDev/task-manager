import React from 'react';
import styles from './SlideCard.module.css';

const SlideCard = ({ imageUrl, title, description }) => {
  return (
    <div className={styles.slideCard}>
      <img src={imageUrl} alt={title} className={styles.slideImage} />
      <div className={styles.slideContent}>
        <h2 className={styles.slideTitle}>{title}</h2>
        <p className={styles.slideDescription}>{description}</p>
      </div>
    </div>
  );
};

export default SlideCard;
