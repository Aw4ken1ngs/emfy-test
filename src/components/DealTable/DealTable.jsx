import React from 'react';
import DealRow from '../DealRow/DealRow';
import DealDetails from '../DealDetails/DealDetails';
import styles from './DealTable.module.css';

const DealTable = ({ deals, selectedDeal, loading, onDealClick }) => {
    return (
        <table className={styles.table}>
            <thead>
            <tr>
                <th>Название</th>
                <th>Бюджет</th>
                <th>ID</th>
            </tr>
            </thead>
            <tbody>
            {deals.map(deal => (
                <DealRow
                    key={`${deal.id}-${deal.updated_at}`}
                    deal={deal}
                    isSelected={selectedDeal === deal.id}
                    onClick={onDealClick}
                    loading={loading}
                >
                    <DealDetails details={deal.details} />
                </DealRow>
            ))}
            </tbody>
        </table>
    );
};

export default DealTable;