import { useState } from 'react';
import { useRepairShopsContext } from '../RepairShop/useRepairShopContext';

export const useRepairShop = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); 

    // destructuring function dispatch from Repair shop context
    const { dispatch } = useRepairShopsContext();

    const getRepairShops = async (identifier) => {
        setIsLoading(true);
        setError(null);
        let decide = "area"
        const Govs = ["Alexandria", "Cairo"]

        if (Govs.includes(identifier)) { 
            decide = "gov"
        }

        try {
            const response = await fetch(`/api/serviceShops?${decide}=${identifier}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const json = await response.json();

            if (!response.ok) {
                setError(json.error || 'Something went wrong');
                setIsLoading(false)
                return false;
            }
            // save the user to local storage in key value pairs
            dispatch({ type: 'GET_REPAIR_SHOPS', payload: json.data});
            return true;
        } catch (err) {
            setError(err.message);
            setIsLoading(false); 
            return false;
        } finally {
            setIsLoading(false); 
        }
    };

    return { isLoading, error, getRepairShops};
};