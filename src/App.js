import React, { useState, useEffect } from 'react';
import './styles.css';

const client = {
    client_id: "734c1c16-f22f-4694-82d0-bfd227cb9c90",
    client_secret: "44dQ4BgLkYKTmnp6ktFJymnP26DKJFdL5joEPzfpLCIgt21s0gRgTBxxuUTaMBqW",
    grant_type: "authorization_code",
    redirect_uri: "https://test.com",
    code: "your_code_here"
};

const fetchWithAuth = async (url, options = {}, token, refreshToken, onRefresh) => {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.status === 401) {
        const newToken = await onRefresh();
        return newToken ? fetchWithAuth(url, options, newToken, refreshToken, onRefresh) : null;
    }

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response;
};

export default function App() {
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
        if (!accessToken) getAccessToken();
    }, [accessToken]);

    useEffect(() => {
        if (accessToken && hasMore && !loading) {
            const timer = setTimeout(getDeals, 1000);
            return () => clearTimeout(timer);
        }
    }, [page, accessToken, hasMore, loading]);

    const getAccessToken = async () => {
        updateState({ loading: true });
        try {
            const response = await fetch("https://infohandformru.amocrm.ru/oauth2/access_token", {
                method: "POST",
                body: JSON.stringify(client),
                headers: { "Content-Type": "application/json" }
            });
            const data = await response.json();
            localStorage.setItem('accessToken', data.access_token);
            localStorage.setItem('refreshToken', data.refresh_token);
            updateState({
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
                loading: false
            });
        } catch (err) {
            updateState({ error: 'Ошибка авторизации', loading: false });
        }
    };

    const refreshAccessToken = async () => {
        try {
            const response = await fetch("https://infohandformru.amocrm.ru/oauth2/access_token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...client,
                    grant_type: "refresh_token",
                    refresh_token: refreshToken
                })
            });
            const data = await response.json();
            localStorage.setItem('accessToken', data.access_token);
            localStorage.setItem('refreshToken', data.refresh_token);
            updateState({
                accessToken: data.access_token,
                refreshToken: data.refresh_token
            });
            return data.access_token;
        } catch (error) {
            localStorage.clear();
            await getAccessToken();
            return null;
        }
    };

    const getDeals = async () => {
        updateState({ loading: true, error: null });
        try {
            const response = await fetchWithAuth(
                `https://infohandformru.amocrm.ru/api/v4/leads?limit=3&page=${page}`,
                { method: "GET" },
                accessToken,
                refreshToken,
                refreshAccessToken
            );

            const text = await response.text();
            const data = text ? JSON.parse(text) : {};

            if (!data._embedded?.leads?.length) {
                updateState({ hasMore: false, loading: false });
                return;
            }

            const newDeals = data._embedded.leads.filter(deal =>
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
            updateState({ error: 'Ошибка загрузки', hasMore: false, loading: false });
        }
    };

    const handleDealClick = async (dealId) => {
        if (selectedDeal === dealId) {
            updateState({ selectedDeal: null });
            return;
        }

        updateState({ loading: true, selectedDeal: dealId, error: null });

        try {
            const response = await fetchWithAuth(
                `https://infohandformru.amocrm.ru/api/v4/leads/${dealId}`,
                { method: "GET" },
                accessToken,
                refreshToken,
                refreshAccessToken
            );

            const data = await response.json();
            updateState({
                deals: deals.map(deal => deal.id === dealId ? { ...deal, details: data } : deal),
                loading: false
            });
        } catch (err) {
            updateState({ error: 'Ошибка загрузки деталей', loading: false });
        }
    };

    const getStatusColor = (taskTimestamp) => {
        if (!taskTimestamp) return 'red';
        const taskDate = new Date(taskTimestamp * 1000);
        const today = new Date();
        const diffDays = Math.ceil((taskDate - today) / (1000 * 60 * 60 * 24));
        return diffDays < 0 ? 'red' : diffDays === 0 ? 'green' : 'yellow';
    };

    return (
        <div className="App">
            <h1>Сделки</h1>
            {error && <div className="error">{error}</div>}
            <table>
                <thead><tr><th>Название</th><th>Бюджет</th><th>ID</th></tr></thead>
                <tbody>
                {deals.map(deal => (
                    <React.Fragment key={`${deal.id}-${deal.updated_at}`}>
                        <tr onClick={() => handleDealClick(deal.id)}>
                            <td>{deal.name}</td>
                            <td>{deal.price}</td>
                            <td>{deal.id}</td>
                        </tr>
                        {selectedDeal === deal.id && (
                            <tr>
                                <td colSpan="3">
                                    {loading ? <div>Загрузка...</div> : deal.details && (
                                        <div>
                                            <p>Название: {deal.details.name}</p>
                                            <p>ID: {deal.details.id}</p>
                                            <p>Дата: {new Date(deal.details.created_at * 1000).toLocaleDateString()}</p>
                                            <p>Статус задачи: <svg width="20" height="20">
                                                <circle cx="10" cy="10" r="8" fill={getStatusColor(deal.details.closest_task_at)} />
                                            </svg></p>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
            {loading && <div>Загрузка...</div>}
            {!hasMore && deals.length > 0 && <div>Все сделки загружены</div>}
        </div>
    );
}