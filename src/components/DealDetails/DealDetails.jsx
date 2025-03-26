import React from 'react';
import styles from './DealDetails.module.css';

const DealDetails = ({ details }) => {
    if (!details) return null;

    const getStatusColor = (taskTimestamp) => {
        if (!taskTimestamp) return 'red';
        const taskDate = new Date(taskTimestamp * 1000);
        const today = new Date();
        const diffDays = Math.ceil((taskDate - today) / (1000 * 60 * 60 * 24));
        return diffDays < 0 ? 'red' : diffDays === 0 ? 'green' : 'yellow';
    };

    return (
        <div className={styles.container}>
            <p><strong>Название:</strong> {details.name}</p>
            <p><strong>ID:</strong> {details.id}</p>
            <p><strong>Дата создания:</strong> {new Date(details.created_at * 1000).toLocaleDateString()}</p>
            <div className={styles.status}>
                <span>Статус задачи: </span>
                <svg width="20" height="20">
                    <circle cx="10" cy="10" r="8" fill={getStatusColor(details.closest_task_at)} />
                </svg>
            </div>
        </div>
    );
};

export default DealDetails;