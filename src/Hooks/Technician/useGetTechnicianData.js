import { useState } from 'react';
import { useTechnicianContext} from "./useTechnicianContext"
export const useGetTechnicianProfile = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const {technician, dispatch } = useTechnicianContext();
    
    const getTechnician = async () => {
        setIsLoading(true);
        setError(null);

        // Safely access technician token and technicianId from normalized technician data
        const token = technician?.token;
        const technicianId = technician?._id;
        
        if (!token || !technician) {
        setError("technician is not yet authenticated");
        setIsLoading(false);
        return false;
        }

        try {
        const response = await fetch(`/api/specialists/${technicianId}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
        });

        const json = await response.json();

        if (!response.ok) {
            setError(json.error || 'Something went wrong');
            return false;
        }

        console.log("Fetched technician profile:", json);
        const technicianData = json.data;

        // Dispatch technician data for profile with token
        dispatch({
            type: 'GET_PROFILE',
            payload: { ...technicianData, token }  
        });

        return technicianData;
        } catch (err) {
        setError('Network error or unexpected issue');
        return false;
        } finally {
        setIsLoading(false);
        }
    };
    return { isLoading, error, getTechnician };
};
