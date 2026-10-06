import { useCallback, useEffect, useState } from 'react';
import { baseUrl } from '../services/BaseUrl';

const useBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const load = useCallback(() => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        setLoading(true);
        setError(false);
        fetch(`${baseUrl}/books/all`, { signal: controller.signal })
            .then(r => r.ok ? r.json() : Promise.reject(new Error('books-request-failed')))
            .then(setBooks)
            .catch(() => setError(true))
            .finally(() => {
                clearTimeout(timeout);
                setLoading(false);
            });
        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, []);

    useEffect(() => { load(); }, [load]);
    return { books, loading, error, reload: load };
};

export default useBooks;
