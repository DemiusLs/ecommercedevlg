import axios from 'axios';

const fetchFilteredPrints = async ({ filter, id_genre }) => {
    try {
        const params = new URLSearchParams();
        if (filter) params.append('filter', filter);
        if (id_genre) params.append('id_genre', id_genre);

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/prints?${params.toString()}`);
        return response.data.data;
    } catch (error) {
        console.error('Errore nel recupero delle stampe filtrate:', error);
        return [];
    }
};

export default fetchFilteredPrints;