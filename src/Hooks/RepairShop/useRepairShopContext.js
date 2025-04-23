import { useContext } from 'react'
import { RepairShopsContext} from '../../context/RepairShops/repairShopsContext'

export const useRepairShopsContext = () => { 
    const context = useContext(RepairShopsContext)

    // check on context if exists
    if (!context)
        throw Error('useRepairShopsContext must be used inside RepairShopsContextProvider')

    return context;
}

