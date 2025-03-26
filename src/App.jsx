import React, { useState, useEffect } from 'react';
import { client, getAccessToken, refreshAccessToken } from './api/auth';
import { fetchDeals, fetchDealDetails } from './api/deals';
import DealTable from './components/DealTable/DealTable';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import LoadingIndicator from './components/LoadingIndicator/LoadingIndicator';
import styles from './styles.module.css';

const App = () => {
    const [state, setState] = useState({
        accessToken: localStorage.getItem('accessToken') || '',
        refreshToken: localStorage.getItem('refreshToken') || '',
        deals: [],
        selectedDeal: null,
        page: 1,
        hasMore: true,
        loading: false,
        error: null
    });

    const { accessToken, refreshToken, deals, selectedDeal, page, hasMore, loading, error } = state;

    const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));

    useEffect(() => {
        if (!accessToken) handleGetAccessToken();
    }, [accessToken]);

    useEffect(() => {
        if (accessToken && hasMore && !loading) {
            const timer = setTimeout(handleGetDeals, 1000);
            return () => clearTimeout(timer);
        }
    }, [page, accessToken, hasMore, loading]);

    const handleGetAccessToken = async () => {
        updateState({ loading: true, error: null });
        try {
            const { access_token, refresh_token } = await getAccessToken();
            localStorage.setItem('accessToken', access_token);
            localStorage.setItem('refreshToken', refresh_token);
            updateState({
                accessToken: access_token,
                refreshToken: refresh_token,
                loading: false
            });
        } catch (err) {
            updateState({ error: 'Ошибка авторизации', loading: false });
        }
    };

    const handleRefreshToken = async () => {
        try {
            const { access_token, refresh_token } = await refreshAccessToken(refreshToken);
            localStorage.setItem('accessToken', access_token);
            localStorage.setItem('refreshToken', refresh_token);
            updateState({
                accessToken: access_token,
                refreshToken: refresh_token
            });
            return access_token;
        } catch (error) {
            localStorage.clear();
            await handleGetAccessToken();
            return null;
        }
    };

    const handleGetDeals = async () => {
        updateState({ loading: true, error: null });
        try {
            const response = await fetchDeals(page, accessToken, refreshToken, handleRefreshToken);

            if (!response._embedded?.leads?.length) {
                updateState({ hasMore: false, loading: false });
                return;
            }

            const newDeals = response._embedded.leads.filter(deal =>
                !deals.some(d => d.id === deal.id)
            );

            if (!newDeals.length) {
                updateState({ hasMore: false, loading: false });
                return;
            }

            updateState({
                deals: [...deals, ...newDeals],
                page: page + 1,
                loading: false
            });
        } catch (err) {
            updateState({ error: 'Ошибка загрузки сделок', hasMore: false, loading: false });
        }
    };

    const handleDealClick = async (dealId) => {
        if (selectedDeal === dealId) {
            updateState({ selectedDeal: null });
            return;
        }

        updateState({ loading: true, selectedDeal: dealId, error: null });

        try {
            const details = await fetchDealDetails(dealId, accessToken, refreshToken, handleRefreshToken);
            updateState({
                deals: deals.map(deal => deal.id === dealId ? { ...deal, details } : deal),
                loading: false
            });
        } catch (err) {
            updateState({ error: 'Ошибка загрузки деталей сделки', loading: false });
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Сделки из amoCRM</h1>
            <ErrorMessage message={error}/>
            <DealTable
                deals={deals}
                selectedDeal={selectedDeal}
                loading={loading}
                onDealClick={handleDealClick}
            />
            <LoadingIndicator loading={loading}/>
            {!hasMore && deals.length > 0 && (
                <div className={styles.allLoaded}>Все сделки загружены</div>
            )}
        </div>
    );
};

export default App;