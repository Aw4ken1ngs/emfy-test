export const client = {
    client_id: "your_client_id",
    client_secret: "your_ client_secret",
    grant_type: "authorization_code",
    redirect_uri: "https://test.com",
    code: "your_code_here"
};

export const fetchWithAuth = async (url, options = {}, token, refreshToken, onRefresh) => {
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

export const getAccessToken = async () => {
    const response = await fetch("https://infohandformru.amocrm.ru/oauth2/access_token", {
        method: "POST",
        body: JSON.stringify(client),
        headers: { "Content-Type": "application/json" }
    });
    return await response.json();
};

export const refreshAccessToken = async (refreshToken) => {
    const response = await fetch("https://infohandformru.amocrm.ru/oauth2/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...client,
            grant_type: "refresh_token",
            refresh_token: refreshToken
        })
    });
    return await response.json();
};