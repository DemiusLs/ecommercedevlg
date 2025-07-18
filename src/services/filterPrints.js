import axios from 'axios';

const fetchFilteredPrints = async ({ filter, genre, query, sort, page = 1, limit = 100 }) => {
    try {
        const params = new URLSearchParams();
        if (filter) params.append('filter', filter);
        if (genre) params.append('genre', genre);
        if (query) params.append('search', query);
        if (sort) params.append('sort', sort);
        params.append('page', page);
        params.append('limit', limit);

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/prints?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Errore nel recupero delle stampe filtrate:', error);
        return { data: [], total: 0, totalPages: 1 };
    }
};

export default fetchFilteredPrints;