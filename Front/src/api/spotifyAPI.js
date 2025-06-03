export const spotifyAPI = async (url, method, body, token) => {
    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: body ? body : null,
        });

        if (!response.ok) {
            console.error("Error en la respuesta de Spotify:", response);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("Error al conectar con Spotify API:", error);
        return null;
    }
};