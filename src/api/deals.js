import { fetchWithAuth } from './auth';

export const fetchDeals = async (page, token, refreshToken, onRefresh) => {
    const response = await fetchWithAuth(
        `https://infohandformru.amocrm.ru/api/v4/leads?limit=3&page=${page}`,
        { method: "GET" },
        token,
        refreshToken,
        onRefresh
    );
    const text = await response.text();
    return text ? JSON.parse(text) : {};
};

export const fetchDealDetails = async (dealId, token, refreshToken, onRefresh) => {
    const response = await fetchWithAuth(
        `https://infohandformru.amocrm.ru/api/v4/leads/${dealId}`,
        { method: "GET" },
        token,
        refreshToken,
        onRefresh
    );
    return await response.json();
};