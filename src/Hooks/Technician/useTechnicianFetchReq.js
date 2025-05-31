import { useState, useEffect } from 'react';
import { useTechnicianContext } from '../../Hooks/Technician/useTechnicianContext';

export const usePaginatedFetch = (url, page) => {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);
    const { technician } = useTechnicianContext();

    useEffect(() => {
        const abortCont = new AbortController();

        if (!technician?.token) {
        setError("No token available.");
        setIsPending(false);
        return;
        }

        fetch(`${url}?page=${page}&limit=5`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${technician.token}`
        },
        signal: abortCont.signal
        })
        .then((res) => {
            if (!res.ok) throw Error("Sorry, could not fetch the data from the resource");
            return res.json();
        })
        .then((fetchedData) => {
            setData(fetchedData.data || []);
            setPagination(fetchedData.pagination || null);
            setIsPending(false);
            setError(null);
        })
        .catch((err) => {
            if (err.name !== 'AbortError') {
            console.error('Fetch error:', err);
            setError(err.message);
            setIsPending(false);
            }
        });

        return () => abortCont.abort();
    }, [url, page, technician?.token]);

    return { data, pagination, isPending, error };
};

