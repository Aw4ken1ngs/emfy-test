import React from 'react';
import styles from './DealRow.module.css';

const DealRow = ({ deal, isSelected, onClick, loading, children }) => {
    return (
        <>
            <tr className={styles.row} onClick={() => onClick(deal.id)}>
                <td>{deal.name}</td>
                <td>{deal.price}</td>
                <td>{deal.id}</td>
            </tr>
            {isSelected && (
                <tr className={styles.detailsRow}>
                    <td colSpan="3" className={styles.detailsCell}>
                        {loading ? (
                            <div className={styles.loading}>Загрузка деталей...</div>
                        ) : (
                            children
                        )}
                    </td>
                </tr>
            )}
        </>
    );
};

export default DealRow;