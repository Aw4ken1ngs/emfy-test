import React from 'react';
import styles from './LoadingIndicator.module.css';

const LoadingIndicator = ({ loading }) => {
    if (!loading) return null;

    return (
        <div className={styles.container}>
            <div className={styles.spinner}></div>
            <span>Загрузка данных...</span>
        </div>
    );
};

export default LoadingIndicator;